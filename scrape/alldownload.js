const fetch = require("node-fetch");

async function post(url) {
  let response = await fetch("https://ssyoutube.com/api/convert", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url }),
  });
  return await response.json();
}

async function ytAudio(url) {
  let data = await post(url);
  let link = data.url.filter((v) => {
    if (v["ext"] === "m4a") {
      return v.url;
    }
  });
  let { title, tags, duration } = data.meta;
  let thumb = data.thumb;
  return (result = {
    link: link[0].url,
    title: title,
    tags: tags,
    duration: duration,
    thumb: thumb,
  });
}

async function ytVideo(url) {
  let data = await post(url);
  let { title, tags, duration } = data.meta;
  let thumb = data.thumb;
  return (result = {
    link: data.url[0].url,
    title: title,
    tags: tags,
    duration: duration,
    thumb: thumb,
  });
}

async function tiktok3(url) {
  let data = await post(url);
  let { title, source } = data.meta;
  let thumb = data.thumb;
  let mp4 = data.url.filter((v) => {
    if (v["ext"] === "mp4") {
      return v.url;
    }
  });
  let mp3 = data.url.filter((v) => {
    if (v["ext"] === "mp3") {
      return v.url;
    }
  });
  return (result = {
    title: title,
    username: source.split(".com/")[1].split("/")[0],
    source: source,
    thumb: thumb,
    mp4: mp4[0].url,
    mp3: mp3[0].url,
  });
}

async function igdl(url) {
  let data = await post(url);
  let link = [];
  if (data[0]) {
    for (var i of data) {
      for (var u of i.url) {
        link.push(u.url);
      }
    }
    let hasil = data.map((v) => {
      return (result = {
        url: link,
        title: v.meta.title,
        source: v.meta.source,
        thunb: v.thumb,
      });
    });
    return hasil[0];
  } else {
    let { title, source } = data.meta;
    let thumb = data.thumb;
    for (var i of data.url) {
      link.push(i.url);
    }
    return (result = {
      url: link,
      title: title,
      source: source,
      thumb: thumb,
    });
  }
}

async function fbdl2(url) {
  let data = await post(url);
  let { title, source } = data.meta;
  let thumb = data.thumb;
  return (result = {
    title: title,
    username: source.split(".com/")[1].split("/")[0],
    source: source,
    thumb: thumb,
    url: data.url[0].url,
  });
}

module.exports = {
  post,
  ytAudio,
  ytVideo,
  tiktok3,
  igdl,
  fbdl2,
};
