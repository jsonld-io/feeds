const Assert = require("assert");
const {Feed} = require("../feeds.js");

describe("feeds", async function() {

  let fetcher = (content) => {
   return (url) => {
    if (content[url]) {
     return {
      ok() {
       return true;
      },
      async json() {
       return content[url];
      }
     }
    }

    return {
     ok() {
      return false;
     }
    };
   };
  };

  it("invalid", async function() {
    try {
     let reader = new Feed("./", fecher({"./": {}}));
    } catch (e) {
     // surpress
    }
  });

  it("no entries", async function() {
    let feed = new Feed("./", fetcher({"./" : {
     "@context": "https://feeds.json-ld.io/2005/Atom",
     "@type": "Feed",
    }}));

    let result = [];
    await feed.foreach((entry) => {
      result.push(entry)
    });
    
    assertThat(result).equalsTo([]);
   });

  it("empty entries", async function() {
    let reader = new Feed("./", fetcher({"./": {
     "@context": "https://feeds.json-ld.io/2005/Atom",
     "@type": "Feed",
     "entries": []
    }}));

    let result = [];
    await reader.foreach((entry) => {
      result.push(entry)
    });
    
    assertThat(result).equalsTo([]);
   });

  it("single entry", async function() {
    let reader = new Feed("./", fetcher({"./": {
     "@context": "https://feeds.json-ld.io/2005/Atom",
     "@type": "Feed",
     "entries": ["hello"]
      }}));

    let result = [];
    await reader.foreach((entry) => {
      result.push(entry)
    });
    
    assertThat(result).equalsTo(["hello"]);
   });

  it("multiple entries", async function() {
    let reader = new Feed("./", fetcher({"./": {
     "@context": "https://feeds.json-ld.io/2005/Atom",
     "@type": "Feed",
     "entries": ["foo", "bar", "hello", "world"]
       }}));

    let result = [];
    await reader.foreach((entry) => {
      result.push(entry)
    });
    
    assertThat(result).equalsTo(["foo", "bar", "hello", "world"]);
   });

  it("next page", async function() {
    let pages = fetcher({
       "./": {
        "@context": "https://feeds.json-ld.io/2005/Atom",
        "@type": "Feed",
        "entries": ["foo", "bar"],
        "links": [{
          "@type": "Link",
          "rel": "next",
          "href": "page2.jsonld"
         }]
       },
       "page2.jsonld": {
        "@context": "https://feeds.json-ld.io/2005/Atom",
        "@type": "Feed",
        "entries": ["hello", "world"],
       }
     });

    let reader = new Feed("./", pages);

    let result = [];
    await reader.foreach((entry) => {
      result.push(entry)
    });
    
    assertThat(result).equalsTo([
      "foo", 
      "bar", 
      "hello", 
      "world"
    ]);
   });

  it("fetch error", async function() {
    let reader = new Feed("./", fetcher({
       "./": {
        "@context": "https://feeds.json-ld.io/2005/Atom",
        "@type": "Feed",
        "entries": ["foo", "bar"],
        "links": [{
          "@type": "Link",
          "rel": "next",
          "href": "not-found.jsonld"
         }]
       }
      }));

    let result = [];
    await reader.foreach((entry) => {
      result.push(entry)
    });
    
    assertThat(result).equalsTo([
      "foo", 
      "bar"
    ]);
   });

  it("checkpoints", async function() {
    let reader = new Feed("./", fetcher({"./": {
        "@context": "https://feeds.json-ld.io/2005/Atom",
        "@type": "Feed",
        "entries": ["foo", "bar"],
       }
      }));

    let result = [];
    let checkpoint;

    let done = await reader.foreach((entry, token) => {
      result.push(entry);

      // saves checkpoint.
      checkpoint = token;

      throw new Error("artificially created error");
    });

    assertThat(checkpoint).equalsTo("./#0");
    assertThat(done).equalsTo(false);

    reader = new Feed("./", fetcher({"./": {
        "@context": "https://feeds.json-ld.io/2005/Atom",
        "@type": "Feed",
        "entries": ["foo", "bar"],
       }
      }), checkpoint);
    done = await reader.foreach((entry, token) => {
      result.push(entry);

      // saves checkpoint.
      checkpoint = token;
    });

    assertThat(done).equalsTo(true);
    
    assertThat(result).equalsTo([
      "foo", 
      "bar"
    ]);
   });

  it.skip("full", function() {
    let feed = {
     "@context": "https://feeds.json-ld.io/2005/Atom",
     "@type": "Feed",
     "links": [{
       "@type": "Link",
       "rel": "self",
       "href": "page1.jsonld"
      }, {
       "@type": "Link",
       "rel": "first",
       "href": "page0.jsonld"
      }, {
       "@type": "Link",
       "rel": "last",
       "href": "page3.jsonld"
      }, {
       "@type": "Link",
       "rel": "next",
       "href": "page2.jsonld"
      }, {
       "@type": "Link",
       "rel": "previous",
       "href": "page0.jsonld"
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

