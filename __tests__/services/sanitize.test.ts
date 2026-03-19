import { describe, expect, it } from "vitest";
import {
  escapeHtmlProperties,
  removeScripts,
  removeScriptsFromArray,
  removeScriptsFromObject,
} from "../../shared/services/sanitize";

describe("sanitize.ts", () => {
  describe("removeScripts()", () => {
    it("should remove script tags from string", () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const result = removeScripts(input);
      expect(result).toBe("Hello  World");
    });

    it("should remove multiple script tags", () => {
      const input =
        "<script>bad1</script>Text<script>bad2</script>More<script>bad3</script>";
      const result = removeScripts(input);
      expect(result).toBe("TextMore");
    });

    it("should handle script tags with attributes", () => {
      const input =
        'Start<script type="text/javascript" src="evil.js">alert("xss")</script>End';
      const result = removeScripts(input);
      expect(result).toBe("StartEnd");
    });

    it("should be case-insensitive for script tags", () => {
      const input = "Text<SCRIPT>bad</SCRIPT>More<Script>bad2</Script>";
      const result = removeScripts(input);
      expect(result).toBe("TextMore");
    });

    it("should return unchanged string if no scripts", () => {
      const input = "Safe string without scripts";
      const result = removeScripts(input);
      expect(result).toBe(input);
    });

    it("should handle empty string", () => {
      const result = removeScripts("");
      expect(result).toBe("");
    });

    it("should handle nested HTML with scripts", () => {
      const input =
        "<div>Content<script>alert('xss')</script><p>More</p></div>";
      const result = removeScripts(input);
      expect(result).toBe("<div>Content<p>More</p></div>");
    });
  });

  describe("removeScriptsFromObject()", () => {
    it("should remove scripts from string properties", () => {
      const obj = {
        email: "john@example.com",
        name: 'John<script>alert("xss")</script>',
      };
      const result = removeScriptsFromObject(obj);
      expect(result.name).toBe("John");
      expect(result.email).toBe("john@example.com");
    });

    it("should preserve non-string properties", () => {
      const obj = {
        active: true,
        age: 30,
        name: "John",
        score: null,
      };
      const result = removeScriptsFromObject(obj);
      expect(result).toEqual(obj);
    });

    it("should handle nested objects", () => {
      const obj = {
        user: {
          name: "John<script>bad</script>",
          profile: {
            bio: 'Developer<script>alert("xss")</script>',
          },
        },
      };
      const result = removeScriptsFromObject(obj);
      expect(result.user.name).toBe("John");
      expect(result.user.profile.bio).toBe("Developer");
    });

    it("should handle nested arrays", () => {
      const obj = {
        items: ["Item1<script>bad</script>", "Item2"],
      };
      const result = removeScriptsFromObject(obj);
      expect(result.items[0]).toBe("Item1");
      expect(result.items[1]).toBe("Item2");
    });

    it("should handle mixed nested structures", () => {
      const obj = {
        metadata: {
          author: "Admin<script>bad</script>",
          keywords: ["keyword1<script>bad</script>", "keyword2"],
        },
        tags: ["tag1<script>bad</script>", "tag2"],
        title: "Welcome<script>xss</script>",
      };
      const result = removeScriptsFromObject(obj);
      expect(result.title).toBe("Welcome");
      expect(result.tags[0]).toBe("tag1");
      expect(result.metadata.author).toBe("Admin");
      expect(result.metadata.keywords[0]).toBe("keyword1");
    });

    it("should handle empty object", () => {
      const result = removeScriptsFromObject({});
      expect(result).toEqual({});
    });

    it("should handle object with null and undefined values", () => {
      const obj = {
        last: undefined,
        middle: null,
        name: "John",
      };
      const result = removeScriptsFromObject(obj);
      expect(result.name).toBe("John");
      expect(result.middle).toBeNull();
      expect(result.last).toBeUndefined();
    });

    it("should respect maxDepth parameter", () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  level6: "Deep<script>bad</script>",
                },
              },
            },
          },
        },
      };
      const result = removeScriptsFromObject(obj, 3);
      // At depth 3, level6 should not be sanitized (return as-is)
      expect(result.level1.level2.level3.level4.level5.level6).toBe(
        "Deep<script>bad</script>",
      );
    });

    it("should handle circular references safely", () => {
      const obj: { name: string; self: unknown } = {
        name: "John<script>bad</script>",
        self: null,
      };
      obj.self = obj;
      // Should not throw and should sanitize name
      const result = removeScriptsFromObject(obj);
      expect(result.name).toBe("John");
    });
  });

  describe("removeScriptsFromArray()", () => {
    it("should remove scripts from array of strings", () => {
      const arr = [
        "Item1<script>bad</script>",
        "Item2",
        "Item3<script>xss</script>",
      ];
      const result = removeScriptsFromArray(arr);
      expect(result).toEqual(["Item1", "Item2", "Item3"]);
    });

    it("should handle array of objects", () => {
      const arr = [{ name: "John<script>bad</script>" }, { name: "Jane" }];
      const result = removeScriptsFromArray(arr);
      expect(result[0].name).toBe("John");
      expect(result[1].name).toBe("Jane");
    });

    it("should handle empty array", () => {
      const result = removeScriptsFromArray([]);
      expect(result).toEqual([]);
    });

    it("should handle array with null/undefined", () => {
      const arr = ["Text<script>bad</script>", null, undefined];
      const result = removeScriptsFromArray(arr);
      expect(result[0]).toBe("Text");
      expect(result[1]).toBeNull();
      expect(result[2]).toBeUndefined();
    });
  });

  describe("escapeHtmlProperties()", () => {
    it("should escape HTML special characters in string properties", () => {
      const obj = {
        content: "Hello & goodbye",
        title: '<script>alert("xss")</script>',
      };
      const result = escapeHtmlProperties(obj);
      expect(result.title).toBe(
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
      );
      expect(result.content).toBe("Hello &amp; goodbye");
    });

    it("should escape all HTML special characters", () => {
      const obj = {
        text: `<>"'&`,
      };
      const result = escapeHtmlProperties(obj);
      expect(result.text).toBe("&lt;&gt;&quot;&#039;&amp;");
    });

    it("should convert non-string values to string and escape", () => {
      const obj = {
        bool: true,
        num: 123,
      };
      const result = escapeHtmlProperties(obj);
      expect(result.num).toBe("123");
      expect(result.bool).toBe("true");
    });

    it("should handle empty object", () => {
      const result = escapeHtmlProperties({});
      expect(result).toEqual({});
    });
  });
});
