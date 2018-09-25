
class Feed {

 constructor(url, fetch, checkpoint) {
  this.reader = Feed.getReader(url, fetch, checkpoint);
 }

 static getReader(url, fetch, checkpoint) {
  let id = url;
  let i = 0;
  let current;

  if (checkpoint) {
   [id, i] = checkpoint.split("#");
   // starts from the next entry.
   i++;
  }

  return {
   async read() {
    if (!current) {
     let response = await fetch(id);
     if (!response.ok) {
      return {done: true};
     }
     current = await response.json();
    }

    if (current["@context"] != "https://feeds.json-ld.io/2005/Atom" ||
        current["@type"] != "Feed") {
     throw new Error(`Invalid feed format`);
    }

    if (!current.entries) {
     return {done: true};
    }

    if (i < current.entries.length) {
     let value = {
      url: id,
      index: i,
      value: current.entries[i]
     };
     i++;
     return {done: false, value: value};
    }

    i = 0;

    let next = (current.links || [])
     .find(link => link.rel == "next");
   
    if (next) {
     let response = await fetch(next.href);
     if (!response.ok) {
      return {done: true};
     }
     id = next.href;
     current = await response.json();
     return this.read();
    }

    return {done: true};
   }
  };
 }
 
 async foreach(body) {
  return await this.loop(this.reader, body);
 }

 async loop(reader, body) {
  while (true) {
   const {done, value} = await reader.read();
   if (done) {
    return true;
   }
   try {
    body(value.value, `${value.url}#${value.index}`);
   } catch (e) {
    // returns with an error and assumes that
    // all continuation will be done in userland.
    return false;
   }
  }
 }
}

module.exports = {
 Feed: Feed
};