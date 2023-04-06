const axios = require('axios')
const cheerio = require('cheerio')

var HEAD = {
				"User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
				"Cookie": `mid=YT5aMwABAAE8mK0FHN7EHT-7pyid;ig_did=D995B665-EE36-4973-8861-2A0B4786235D;ig_nrcb=1;ds_user_id=43861906163;shbid="17127${"\\054"}43861906163${"\\054"}1670856750:01f79b44863db58824e730fc52c82d7cedc3506c041aa26c0f0bf43903dad0782059cf25";shbts="1639320750${"\\054"}43861906163${"\\054"}1670856750:01f74a65cecf18936d320a91fa0dfb796195263a1f205e3adeda2403b1440ef7b23f7c86";fbm_124024574287414=base_domain=.instagram.com;fbsr_124024574287414=2PSStdYWIn7-Disv7mVpT5PdHKopiM_cm3g46nAKjIk.eyJ1c2VyX2lkIjoiMTAwMDMzOTU5OTIzNTc4IiwiY29kZSI6IkFRQjVMMGgtdFpnY0NVWXlXaVNlRTMyRmhxUGVrRzFtNVlMdG52T1NmRnV4UG9QUDQ3WmtJU1NWa1FIMU55Z3pGaEJaZkFaYUJza0RmazJ0N18xUG9rWlprcHZMQXo5RzJaTVZyaXRnX3Fxd0UxbUsyYVBSckxUYmFlNHlmb0hRLVBxUzVpSFRtYlFGTTdxWE02UHlyeVp4cFRJRmQ3LUpuRnpWSjVCQ0QxRE5EYndiLWh6RlJWZ3lUcEZ5UEJMcG9XT1o2dW9NUzNxLWR5ZmlXRkdTWWxZdjdIZzhzZHZLdlNHTm5qQy1zZkpvYTVUOS1SaE9uR3ZIT0NqREZqbHc2UmdnUTNSM3lzcVBpUU1SaUQ2NC1NUjhJajZGY2M4OGlDVThPV2JzM1lnVS1HQW84dTIwcjJBc3QtSThVb05lcVoyQ3g5eXlUNTZaaWZ2azhEWGpLY29UIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUxaQjR0emdCMUl2cEpaQmwyRlloZmJaQUlZdURXVGJyTExlTHdPWkJVNTdtNU95UERkUmpnRWtOa20xV2Y3UmtoYmtlZTYwN0Fub2EyblpBZGpkNUtOZlZyN1RFNncyMWhIaGtZemZ4S0Z1WkFaQTVUY0ZqbHNqTER0REpkTHJFWkNEUDVxajZYeVU0R2tGVXUxRHZjYThjVWdPdDBZb01XUmJneFUwV0FiYiIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjM5NjQ5Mjc4fQ;csrftoken=oV5tUVvJDTUlqVVXo10ctGmpPbFdeU5Z;rur=PRN;sessionid=43861906163%3AkYOCESDhCRUx5t%3A7`,
				"Origin": "https://www.instagram.com",
				"Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
			};
async function igstalk(username) {
	return new Promise(async (resolve, reject) => {
	  const getCookie = await axios.get("https://www.instagram.com/");
		await axios.request({
			method: "get",
			url: `https://www.instagram.com/${username}/?__a=1`,
			headers: HEAD
		}).then(anu => {
			const metaData = anu.data.graphql.user;
			const final = {
				username: metaData.username,
				full_name: metaData.full_name ? metaData.full_name : "-",
				biography: metaData.biography ? metaData.biography : "-",
				followers: metaData.edge_follow.count + " Followers",
				following: metaData.edge_followed_by.count + " Following",
				posts_count: metaData.edge_owner_to_timeline_media.edges.map(x => x.node).length + " Posts",
				external_url: metaData.external_url ? metaData.external_url : "-",
				is_private: metaData.is_private === false ? "Not Private" : "Private Account",
				is_verified: metaData.is_verified === false ? "Not Verified" : "Is Verified",
				profile_url: metaData.profile_pic_url_hd
			};
			resolve(final);
		}).catch(reject);
	});
}



module.exports = {
  igstalk
}