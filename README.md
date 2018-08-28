ATOM feeds in JSON-LD.

# Example

```javascript
{
  "@context": "https://feeds.json-ld.io/2005/Atom",
  "@type": "Feed",
  "title": "Example Feed",
  "subtitle": "A subtitle.",
  "links": [{
      "@type": "Link",
      "href": "http://example.org/feed/",
      "rel": "self"
    }, {
      "@type": "Link",
      "href": "http://example.org/"
  }],
  "id": "urn:uuid:60a76c80-d399-11d9-b91C-0003939e0af6",
  "updated": "2003-12-13T18:30:02Z",
  "entries": [{
      "title": "Atom-Powered Robots Run Amok",
      "links": [{
          "@type": "Link",
          "href": "http://example.org/2003/12/13/atom03"
        }, {
          "@type": "Link",
          "rel": "alternate",
          "type": "text/html",
          "href": "http://example.org/2003/12/13/atom03.html"
        }, {
          "@type": "Link",
          "rel": "edit",
          "href": "http://example.org/2003/12/13/atom03/edit"
      }],
      "id": "urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a",
      "updated": "2003-12-13T18:30:02Z",
      "summary": "Some text.",
      "content": {
        "type": "xhtml",
        "value": ""
      },
      "author": {
        "name": "John Doe",
        "email": "johndoe@example.com"
      }
    }
  ]
}
```

# Extensions

```javascript
{
  "@context": "https://feeds.json-ld.io/2005/Atom",
  "@type": "Feed",
  "title": "Example Feed",
  "subtitle": "A subtitle.",
  "entries": [{
      "title": "Atom-Powered Robots Run Amok",
      "summary": "Some text.",
      "content": {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Tide",
        "description": "The best detergent ever!"
      }
    }
  ]
}
```

# Schema

# Feed

 The ```Feed``` element is the document (i.e., top-level) element of
   an Feed Document, acting as a container for metadata and data
   associated with the feed.

| Property      | Type                  | Description  |
| ------------- |-----------------------| -------------|
| author        | [Person](#Person)     |              |
| category      | [Category](#Category) |              |
| contributor   | [Person](#Person)     |              |
| generator     | [Generator](#Generator)|              |
| icon          | [URI](#URI)           |              |
| id            |                       |              |
| link          | [Link](#Link)         |              |
| logo          | [Link](#Link)         |              |
| rights        | [Text](#Text)         |              |
| subtitle      | [Text](#Text)         |              |
| title         | [Text](#Text)         |              |
| updated       | [Date](#Date)         |              |


# Entry

The ```Entry``` element represents an individual entry, acting as a
   container for metadata and data associated with the entry. 


| Property      | Type                  | Description  |
| ------------- |-----------------------| -------------|
| author        | [Person](#Person)     |              |
| category      | [Category](#Category) |              |
| content       | [Content](#Content)   |              |
| contributor   | [Person](#Person)     |              |
| id            |                       |              |
| link          | [Link](#Link)         |              |
| published     | [Date](#Date)         |              |
| rights        | [Text](#Text)         |              |
| source        |                       |              |
| summary       | [Text](#Text)         |              |
| title         | [Text](#Text)         |              |
| updated       | [Text](#Text)         |              |

# Person

 A Person construct is an element that describes a person, corporation, or similar entity (hereafter, 'person').


| Property      | Type                  | Description  |
| ------------- |-----------------------| -------------|
| name          | [Text](#Text)         |              |
| uri           | [URI](#URI)           |              |
| email         | [Text](#Text)         |              |

# Content

The ```Content``` element either contains or links to the content of the ```Entry```.

| Property      | Type                  | Description  |
| ------------- |-----------------------| -------------|
| type          | ```text```, ```html``` or ```xhtml```||
| src           | [URI](#URI)           |              |

# Category

The ```Category``` element conveys information about a category associated with an entry or feed.  This specification assigns no meaning to the content (if any) of this element.

| Property      | Type                  | Description  |
| ------------- |-----------------------| -------------|
| term          | [Text](#Text)         |              |
| scheme        | [URI](#URI)           |              |
| label         | [Text](#Text)         |              |

# Generator

 The ```Category``` element conveys information about a category associated with an entry or feed.  This specification assigns no meaning to the content (if any) of this element.

| Property      | Type                  | Description  |
| ------------- |-----------------------| -------------|
| uri           | [URI](#URI)           |              |
| version       | [Text](#Text)         |              |
| text          | [Text](#Text)         |              |

# Link

 The ```Link``` element defines a reference from an entry or feed to a Web resource.  This specification assigns no meaning to the content (if any) of this element.
   
| Property      | Type                  | Description  |
| ------------- |-----------------------| -------------|
| href          | [URI](#URI)           |              |
| rel           | [Text](#Text)         |              |
| type          | [Text](#Text)         |              |
| hreflang      | [RFC3066](https://tools.ietf.org/html/rfc3066)         |              |
| title         | [Text](#Text)         |              |
| length        | [Text](#Text)         |              |

# URI

# Date

 A Date construct is an element whose content MUST conform to the "date-time" production in [RFC3339](https://tools.ietf.org/html/rfc3339).  In addition, an uppercase "T" character MUST be used to separate date and time, and an uppercase "Z" character MUST be present in the absence of a numeric time zone offset.

Examples:

* 2003-12-13T18:30:02Z
* 2003-12-13T18:30:02.25Z
* 2003-12-13T18:30:02+01:00
* 2003-12-13T18:30:02.25+01:00

# Text

A Text construct contains human-readable text, usually in small quantities.  The content of Text constructs is Language-Sensitive.
