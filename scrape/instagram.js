/**
 * Author  : Farhannnnn
 * Name    : Instagram Fetcher
 * Tools   : Download, Stalker, Stories, Story, IGTV
 * Version : 1.0
 * Update  : 03 March 2022
 * 
 * If you are a reliable programmer or the best developer, please don't change anything.
 * If you want to be appreciated by others, then don't change anything in this script.
 * Please respect me for making this tool from the beginning.
 */

//Internal Modules

const { h2k, msConvert } = require('./../lib/myfunc.js');

//External Modules
const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash');

class Instagram {
	constructor() {
		this.headers = {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36',
			'Cookie': `mid=YT5aMwABAAE8mK0FHN7EHT-7pyid;ig_did=D995B665-EE36-4973-8861-2A0B4786235D;ig_nrcb=1;ds_user_id=43861906163;shbid="17127${"\\054"}43861906163${"\\054"}1670856750:01f79b44863db58824e730fc52c82d7cedc3506c041aa26c0f0bf43903dad0782059cf25";shbts="1639320750${"\\054"}43861906163${"\\054"}1670856750:01f74a65cecf18936d320a91fa0dfb796195263a1f205e3adeda2403b1440ef7b23f7c86";fbm_124024574287414=base_domain=.instagram.com;fbsr_124024574287414=2PSStdYWIn7-Disv7mVpT5PdHKopiM_cm3g46nAKjIk.eyJ1c2VyX2lkIjoiMTAwMDMzOTU5OTIzNTc4IiwiY29kZSI6IkFRQjVMMGgtdFpnY0NVWXlXaVNlRTMyRmhxUGVrRzFtNVlMdG52T1NmRnV4UG9QUDQ3WmtJU1NWa1FIMU55Z3pGaEJaZkFaYUJza0RmazJ0N18xUG9rWlprcHZMQXo5RzJaTVZyaXRnX3Fxd0UxbUsyYVBSckxUYmFlNHlmb0hRLVBxUzVpSFRtYlFGTTdxWE02UHlyeVp4cFRJRmQ3LUpuRnpWSjVCQ0QxRE5EYndiLWh6RlJWZ3lUcEZ5UEJMcG9XT1o2dW9NUzNxLWR5ZmlXRkdTWWxZdjdIZzhzZHZLdlNHTm5qQy1zZkpvYTVUOS1SaE9uR3ZIT0NqREZqbHc2UmdnUTNSM3lzcVBpUU1SaUQ2NC1NUjhJajZGY2M4OGlDVThPV2JzM1lnVS1HQW84dTIwcjJBc3QtSThVb05lcVoyQ3g5eXlUNTZaaWZ2azhEWGpLY29UIiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQUxaQjR0emdCMUl2cEpaQmwyRlloZmJaQUlZdURXVGJyTExlTHdPWkJVNTdtNU95UERkUmpnRWtOa20xV2Y3UmtoYmtlZTYwN0Fub2EyblpBZGpkNUtOZlZyN1RFNncyMWhIaGtZemZ4S0Z1WkFaQTVUY0ZqbHNqTER0REpkTHJFWkNEUDVxajZYeVU0R2tGVXUxRHZjYThjVWdPdDBZb01XUmJneFUwV0FiYiIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjM5NjQ5Mjc4fQ;csrftoken=oV5tUVvJDTUlqVVXo10ctGmpPbFdeU5Z;rur=PRN;sessionid=43861906163%3AkYOCESDhCRUx5t%3A7`,
			'Origin': 'https://www.instagram.com',
			'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
		};
	}
	download(url) {
		return new Promise(async (resolve, reject) => {
			const media_id = /(?<=instagram.com\/(?:p|reel|tv|([A-Za-z0-9-_.]+\/(reel|p|tv)))\/)[A-Za-z0-9-_.]+/gi.exec(url)[0];
			const fullURL = 'https://www.instagram.com/p/' + media_id + '/?__a=1';
			let status = false;
			await axios.request({
				method: 'GET',
				url: fullURL,
				headers: this.headers
			}).then(({ data }) => {
				if (!data.hasOwnProperty('items')) return reject(Error('items not found'));
				const metadata = data.items[0];
				if (metadata.carousel_media_count) {
					let result_url = new Array();
					for (let i = 0; i < metadata.carousel_media_count; i++) {
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
						media_count: metadata.carousel_media_count,
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
	stories(url) {
		return new Promise(async (resolve, reject) => {
			let { headers, data } = await axios.get('https://instafinsta.com/insta-stories-download');
			const $ = cheerio.load(data);
			const loot = $('form > input').get().map(i => {
				return {
					name: $(i).attr('name'),
					value: $(i).attr('value')
				};
			});
			if (!Array.isArray(loot)) throw Error('failed get value');
			await axios.request({
				method: 'POST',
				url: 'https://instafinsta.com/download',
				data: `${loot[0].name}=${loot[0].value}&${loot[1].name}=${loot[1].value}&${loot[2].name}=${loot[2].value}&link=${url}`,
				headers: {
					cookie: headers['set-cookie']
				}
			}).then(async ({ data }) => {
				const $ = cheerio.load(data);
				const result = $('video > source').attr('src');
				resolve(result);
			}).catch(e => {
				console.error(e);
				reject(Error(e));
			});
		})
	}
	tv(link) {
		return new Promise(async (resolve, reject) => {
			const regexUrl = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/tv\/([-_0-9A-Za-z]{5,18})/gi.exec(link);
			let url = `https://www.instagram.com/tv/${regexUrl[1]}/?__a=1`;
			let { data } = await axios({
				url,
				method: 'GET',
				headers: this.headers
			});
			if (!data.hasOwnProperty('items')) return reject(Error('data undefined'));
			let [result] = _.shuffle(data.items);
			let { user, image_versions2, video_versions, caption } = result;
			const title = caption.text;
			const username = user.username;
			const full_name = user.full_name;
			const verified = user.is_verified;
			const comments = result.comment_count;
			const viewers = result.view_count;
			const likes = result.like_count;
			const thumbnail = _.sample(image_versions2.candidates).url;
			const result_url = _.sample(video_versions).url;
			resolve({
				caption: title,
				username,
				full_name,
				verified,
				comments,
				viewers,
				likes,
				thumbnail,
				url: result_url
			})
		});
	}
	stalker(username) {
		return new Promise(async (resolve, reject) => {
			await axios.request({
				method: 'GET',
				url: `https://www.instagram.com/${username}/?__a=1`,
				headers: this.headers
			}).then(({ data }) => {
				const metaData = data.graphql.user;
				const result = {
					username: metaData.username,
					full_name: metaData.full_name ? metaData.full_name : '-',
					biography: metaData.biography ? metaData.biography : '-',
					following: h2k(metaData.edge_follow.count) + ' Following',
					followers: h2k(metaData.edge_followed_by.count) + ' Followers',
					posts_count: h2k(metaData.edge_owner_to_timeline_media.edges.map(x => x.node).length) + ' Posts',
					external_url: metaData.external_url ? metaData.external_url : '-',
					is_private: metaData.is_private !== true ? 'Not Private' : 'Private Account',
					is_verified: metaData.is_verified !== true ? 'Not Verified' : 'Is Verified',
					profile_url: metaData.profile_pic_url_hd
				};
				resolve(result);
			}).catch(reject);
		});
	}

	story(username) {
		return new Promise(async (resolve, reject) => {
			axios.request({
				url: 'https://www.instagramsave.com/instagram-story-downloader.php',
				method: 'GET',
				headers: {
					'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
					'cookie': 'PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg'
				}
			}).then(async ({ data }) => {
				const $ = cheerio.load(data);
				const token = $('#token').attr('value');
				let config = {
					headers: {
						'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
						'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
						'cookie': 'PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg',
						'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
					},
					data: `url=${encodeURIComponent('https://www.instagram.com/') + username}&action=story&token=${token}`
				};
				await axios.post('https://www.instagramsave.com/system/action.php', config.data, {
					headers: config.headers
				}).then(({ data }) => {
					resolve(data.medias);
				});
			}).catch(reject);
		});
	}
}

module.exports = {
	Instagram
};
