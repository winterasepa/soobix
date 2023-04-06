const axios = require("axios")
const qs = require("qs");
const cheerio = require("cheerio");
const request = require("request");
const _ = require('lodash')
const { h2k, msConvert } = require('./../lib/myfunc');
const regexURL = require('./../lib/regex');

function igdl4(url) {
		return new Promise(async (resolve, reject) => {
			if (!regexURL.instagram(url)) throw 'Invalid URL';
			const media_id = /(?<=instagram.com\/(?:p|reel|([A-Za-z0-9-_.]+\/(reel|p)))\/)[A-Za-z0-9-_.]+/gi.exec(url)[0];
			const fullURL = 'https://www.instagram.com/p/' + media_id + '/?__a=1';
			let status = false;
			await axios.request({
				method: 'GET',
				url: fullURL,
				headers: {
			'User-Agent': 'Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36',
			'Cookie': `mid=YT5aMwABAAE8mK0FHN7EHT-7pyid;ig_did=D995B665-EE36-4973-8861-2A0B4786235D;ig_nrcb=1;ds_user_id=43861906163;shbid="17127${"\\054"}43861906163${"\\054"}1670856750:01f79b44863db58824e730fc52c82d7cedc3506c041aa26c0f0bf43903dad0782059cf25";shbts="1639320750${"\\054"}43861906163${"\\054"}1670856750:01f74a65cecf18936d320a91fa0dfb796195263a1f205e3adeda2403b1440ef7b23f7c86";fbm_124024574287414=base_domain=.instagram.com;fbsr_124024574287414=2PSStdYWIn7-Disv7mVpT5PdHKopiM_cm3g46nAKjIk.eyJ1c2VyX2lkIjoiMTAwMDMzOTU5OTIzNTc4IiwiY29kZSI6IkFRQjVMMGgtdFpnY0NVWXlXaVNlRTMyRmhxUGVrRzFtNVlMdG52T1NmRnV4UG9QUDQ3WmtJU1NWa1FIMU55Z3pGaEJaZkFaYUJza0RmazJ0N18xUG9rWlprcHZMQXo5RzJaTVZyaXRnX3Fxd0UxbUsyYVBSckxUYmFlNHlmb0hRLVBxUzVpSFRtYlFGTTdxWE02UHlyeVp4cFRJRmQ3LUpuRnpWSjVCQ0QxRE5EYndiLWh6RlJWZ3lUcEZ5UEJMcG9XT1o2dW9NUzNxLWR5ZmlXRkdTWWxZdjdIZzhzZHZLdlNHTm5qQy1zZkpvYTVUOS1SaE9uR3ZIT0NqREZqbHc2UmdnUTNSM3lzcVBpUU1SaUQ2NC1NUjhJajZGY2M4OGlDVThPV2JzM1lnVS1HQW84dTIwcjJBc3QtSThVb05lcVoyQ3g5eXlUNTZaaWZ2azhEWGpLY29UIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUxaQjR0emdCMUl2cEpaQmwyRlloZmJaQUlZdURXVGJyTExlTHdPWkJVNTdtNU95UERkUmpnRWtOa20xV2Y3UmtoYmtlZTYwN0Fub2EyblpBZGpkNUtOZlZyN1RFNncyMWhIaGtZemZ4S0Z1WkFaQTVUY0ZqbHNqTER0REpkTHJFWkNEUDVxajZYeVU0R2tGVXUxRHZjYThjVWdPdDBZb01XUmJneFUwV0FiYiIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjM5NjQ5Mjc4fQ;csrftoken=oV5tUVvJDTUlqVVXo10ctGmpPbFdeU5Z;rur=PRN;sessionid=43861906163%3AkYOCESDhCRUx5t%3A7`,
			'Origin': 'https://www.instagram.com',
			'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
		}
			}).then(({ data }) => {
				if (!data.hasOwnProperty('items')) return reject(Error('items not found'));
				const metadata = data.items[0];
				if (metadata.carousel_media_count) {
					const media_count = metadata.carousel_media_count;
					let result_url = new Array();
					for (let i = 0; i < media_count; i++) {
						result_url.push({
							type: metadata.carousel_media[i].media_type !== 2 ? 'image' : 'video',
							url: _.sample(metadata.carousel_media[i].image_versions2.candidates).url
						});
					}
					resolve({
						status: true,
						username: metadata.user.username,
						fullname: metadata.user.full_name,
						like_count: metadata.like_count,
						comment_count: metadata.comment_count,
						media_count,
						caption: !metadata.caption ? metadata.caption : metadata.caption.text,
						result_url
					});
				} else {
					if (metadata.media_type !== 2 || metadata.media_type === 1) {
						resolve({
							status: true,
							type: 'image',
							media_count: '1',
							username: metadata.user.username,
							fullname: metadata.user.full_name,
							like_count: h2k(metadata.like_count),
							comment_count: h2k(metadata.comment_count),
							caption: !metadata.caption ? metadata.caption : metadata.caption.text,
							url: _.sample(metadata.image_versions2.candidates).url
						});
					} else {
						let metadata_music;
						const music_data = metadata.clips_metadata && metadata.clips_metadata.music_info && metadata.clips_metadata.music_info.music_asset_info;
						if (!music_data) metadata_music = 'original song';
						else metadata_music = {
							music_title: music_data.title || undefined,
							music_artist: music_data.display_artist || undefined,
							music_url: music_data.progressive_download_url || undefined
						};
						resolve({
							status: true,
							type: 'video',
							media_count: '1',
							username: metadata.user.username,
							fullname: metadata.user.full_name,
							duration: msConvert(String(metadata.video_duration).split('.').join('')),
							viewers: h2k(metadata.view_count),
							play_count: h2k(metadata.play_count || 1),
							like_count: h2k(metadata.like_count),
							comment_count: h2k(metadata.comment_count),
							caption: !metadata.caption ? metadata.caption : metadata.caption.text,
							thumbnail: _.sample(metadata.image_versions2.candidates).url,
							url: _.sample(metadata.video_versions).url,
							metadata_music
						});
					}
				}
			}).catch(reject);
		});
	} 
module.exports = {
  igdl4
}