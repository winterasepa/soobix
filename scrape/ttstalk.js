const axios = require('axios')
const cheerio = require('cheerio')

async function ttstalk(username) {
    return new Promise((resolve, reject) => {
        axios.request({
            method: "GET",
            url: `https://tiktok.com/@${username}`,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
                "Cookie": "tt_webid_v2=7023321823367792130;tt_webid=7023321823367792130;tt_csrf_token=Ko3eYWlaA81BtC_6ezxMN4qf;R6kq3TV7=AHwiLLx8AQAAlTgrDyev4OA6MBZL078p4m5wG5CZEK8rU7kHUbizioKGVR8j|1|0|5839bf36b909a5e044847442b7d4dc0390a72e59;ttwid=1%7C3p7mb0Z4EWtFfmmqArdM4PqSNcyXZe23Vy0tPgsbyyI%7C1635244602%7C5fb19e46484c8c4f840b7c941ff4edea0fdcd8b6ea13576295a0268f37080669;s_v_web_id=verify_kv7yey5z_ZCLcdnz5_Mmf4_4XZZ_9ZFw_ZEjGJdo9qi62;msToken=p0SYyf1ujFiJcET1HDLeL2j4-2760D8ueZK-hU4TBTYI9NPKlB3IMnO9GXHm3GK2wi7xJoMGlsz9Kta1ls13_Vgt9izMlk2bBiOe8EmdRd5UrGaJMZn3oBTfwmiMexhYBC8d"
            }
        }).then(({
            data
        }) => {
            $ = cheerio.load(data);
            script = $("script#__NEXT_DATA__").get();
            let parse;
            for (let anu of script) {
                if ((anu.children && anu.children[0] && anu.children[0].data) !== undefined) {
                    json = anu.children[0].data;
                    parse = JSON.parse(json);
                }
            }
            const anu = parse.props.pageProps.userInfo;
            const time = new Date(anu.user.createTime * 1000);
            const verif = anu.user.verified;
            const privAkun = anu.user.privateAccount;
            resolve({
                username: anu.user.uniqueId,
                nickname: anu.user.nickname,
                signature: anu.user.signature || "-",
                createTime: time,
                verified: typeof verif !== false ? "User Verified" : "Not Verified",
                privateAccount: typeof privAkun !== false ? "Private Account" : "Public Account",
                followers: anu.stats.followerCount,
                followings: anu.stats.followingCount,
                hearts: anu.stats.heart,
                heartsCount: anu.stats.heartCount,
                videoCount: anu.stats.videoCount,
                diggCount: anu.stats.diggCount,
                profile: anu.user.avatarThumb
            });
        }).catch(reject);
    });
}


module.exports = {
  ttstalk
}