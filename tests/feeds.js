const Assert = require("assert");

describe("feeds", async function() {

  function getReader(feed, fetch) {
   if (feed["@context"] != "https://feeds.json-ld.io/2005/Atom" ||
       feed["@type"] != "Feed") {
    throw new Error(`Invalid feed format: (@context: ${feed["@context"]}, @type: ${feed["@type"]})`);
   }
   
   let current = feed;
   let i = 0;
   return {
    async read() {
     if (!current.entries) {
      return {done: true};
     }

     if (i < current.entries.length) {
      let value = current.entries[i];
      i++;
      return {done: false, value: value};
     }

     i = 0;

     let next = (current.links || [])
      .find(link => link.rel == "next");
     
     if (next) {
      let response = await fetch(next.href);
      if (!response.ok()) {
       return {done: true};
      }
      current = await response.json();
      return this.read();
     }

     return {done: true};
    }
   };
  }

  async function foreach(reader, body) {
   while (true) {
    const {done, value} = await reader.read();
    if (done) {
     break;
    }
    body(value);
   }
  }

  it("invalid", async function() {
    try {
     let reader = getReader({});
    } catch (e) {
     // surpress
    }
  });

  it("no entries", async function() {
    let reader = getReader({
     "@context": "https://feeds.json-ld.io/2005/Atom",
     "@type": "Feed",
    });

    let result = [];
    await foreach(reader, (entry) => {
      result.push(entry)
    });
    
    assertThat(result).equalsTo([]);
   });

  it("empty entries", async function() {
    let reader = getReader({
     "@context": "https://feeds.json-ld.io/2005/Atom",
     "@type": "Feed",
     "entries": []
    });

    let result = [];
    await foreach(reader, (entry) => {
      result.push(entry)
    });
    
    assertThat(result).equalsTo([]);
   });

  it("single entry", async function() {
    let reader = getReader({
     "@context": "https://feeds.json-ld.io/2005/Atom",
     "@type": "Feed",
     "entries": ["hello"]
    });

    let result = [];
    await foreach(reader, (entry) => {
      result.push(entry)
    });
    
    assertThat(result).equalsTo(["hello"]);
   });

  it("multiple entries", async function() {
    let reader = getReader({
     "@context": "https://feeds.json-ld.io/2005/Atom",
     "@type": "Feed",
     "entries": ["foo", "bar", "hello", "world"]
    });

    let result = [];
    await foreach(reader, (entry) => {
      result.push(entry)
    });
    
    assertThat(result).equalsTo(["foo", "bar", "hello", "world"]);
   });

  it("next page", async function() {
    let fetch = async function(url) {
     return {
      ok() {
       return true;
      },
      async json() {
       return {
        "@context": "https://feeds.json-ld.io/2005/Atom",
        "@type": "Feed",
        "entries": ["hello", "world"],
       };
      }
     };
    };
    let reader = getReader({
     "@context": "https://feeds.json-ld.io/2005/Atom",
     "@type": "Feed",
     "entries": ["foo", "bar"],
     "links": [{
       "@type": "Link",
       "rel": "next",
       "href": "page2.xml"
     }]
    }, fetch);

    let result = [];
    await foreach(reader, (entry) => {
      result.push(entry)
    });
    
    assertThat(result).equalsTo([
      "foo", 
      "bar", 
      "hello", 
      "world"
    ]);
   });

  it.skip("full", function() {
    let feed = {
     "@context": "https://feeds.json-ld.io/2005/Atom",
     "@type": "Feed",
     "links": [{
       "@type": "Link",
       "rel": "self",
       "href": "page1.xml"
      }, {
       "@type": "Link",
       "rel": "first",
       "href": "page0.xml"
      }, {
       "@type": "Link",
       "rel": "last",
       "href": "page3.xml"
      }, {
       "@type": "Link",
       "rel": "next",
       "href": "page2.xml"
      }, {
       "@type": "Link",
       "rel": "previous",
       "href": "page0.xml"
      }]
    };

  });

  it.skip("websub", function() {
  });

  it.skip("updates", function() {
  });

  function assertThat(x) {
   return {
    equalsTo(y) {
     Assert.deepEqual(x, y);
    }
   }
  }

});

