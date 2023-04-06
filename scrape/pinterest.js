const axios = require("axios")
const cheerio = require("cheerio")
const fetch = require("node-fetch")

async function pinterest(query) {
	let text = query.slice(0)[0].toUpperCase()
	const { data } = await axios.get(`https://es.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(text + query.slice(1))}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${text + query.slice(1)}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`)
	const randomObj = (arr) => {
	  return arr[Math.floor(Math.random() * arr.length)]
	}
	
	let res = randomObj(data.resource_response.data.results)
	
	return ({
	  title: res.board.name,
	  username: res.pinner.username,
	  quality: res.images.orig.height + 'x' + res.images.orig.width,
	  link: res.images.orig.url
	  })
}

async function pindl(url) {
    return new Promise(async (resolve, reject) => {
    	const URL = await Api.pinr(url)
        axios.get('https://www.pinterest.es/pin/' + URL + '/', {
            headers: {
                "cookie": "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
            }
        }).then(({ data }) => {
            const $ = cheerio.load(data)
            const result = [];
            const info_pin = []
            $('script#__PWS_DATA__').each((i, elem) => {
                // console.log(JSON.parse($(elem.children).text()))
                info_pin.push(JSON.parse($(elem.children).text()))
            })

	    const metaData = info_pin[0]['props']['initialReduxState']['pins'][URL]
	    var pinterest_Media = []
            if (!metaData.videos) {
            pinterest_Media.push({
                    type: 'image',
                    quality: 'HD',
                    url: metaData.images.orig.url
                    })
            } else {
                pinterest_Media.push({
                    type: 'video',
                    url: metaData.videos.video_list['V_720P']['url'],
                    previewUrl: metaData.videos.video_list['V_720P']['thumbnail'],
                    duration: metaData.videos.video_list['V_720P']['duration']
                })
            }

            resolve({
            	full_name: metaData.closeup_attribution.full_name,
            	user_name: metaData.closeup_attribution.username,
            	followers: metaData.closeup_attribution.follower_count,
            	comments: metaData.aggregated_pin_data.comment_count,
            	share: metaData.share_count,
            	save: metaData.aggregated_pin_data.aggregated_stats.saves,
            	pin_data: pinterest_Media
            })

        }).catch(err => {
            reject({ status: 404, message: err })
        })
    })
}

/*const pintrs = (query) => {
	let text = query.slice(0)[0].toUpperCase()
	const { data } = await axios.get(`https://es.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(text + query.slice(1))}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${text + query.slice(1)}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`)
	const randomObj = (arr) => {
	  return arr[Math.floor(Math.random() * arr.length)]
	}
	
	let res = randomObj(data.resource_response.data.results)
	
	return ({
	  title: res.board.name,
	  username: res.pinner.username,
	  quality: res.images.orig.height + 'x' + res.images.orig.width,
	  link: res.images.orig.url
	  })
}*/



module.exports = { pinterest, pindl }
