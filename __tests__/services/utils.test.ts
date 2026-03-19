import { describe, expect, it } from "vitest";
import {
  addPlus,
  capitalizeFirstLetter,
  feetToMeter,
  getFirstLetter,
  getFirstWord,
  meterToFeet,
  numberToWeight,
  parseObjectToQueryParams,
  removeFalseOrNullProperties,
  sliceString,
  transformSingular,
} from "../../shared/services/utils";

describe("utils.ts", () => {
  describe("parseObjectToQueryParams()", () => {
    it("should create query string from object", () => {
      const obj = {
        active: true,
        age: "30",
        name: "John",
      };
      const result = parseObjectToQueryParams(obj);
      expect(result).toContain("name=John");
      expect(result).toContain("age=30");
      expect(result).toContain("active=true");
    });

    it("should filter out false and undefined values", () => {
      const obj = {
        active: false,
        middle: undefined,
        name: "John",
      };
      const result = parseObjectToQueryParams(obj);
      expect(result).toContain("name=John");
      expect(result).not.toContain("middle");
      expect(result).not.toContain("active");
    });

    it("should handle empty object", () => {
      const result = parseObjectToQueryParams({});
      expect(result).toBe("");
    });

    it("should handle single property", () => {
      const result = parseObjectToQueryParams({ search: "query" });
      expect(result).toBe("search=query");
    });

    it("should handle numeric values", () => {
      const obj = {
        limit: 10,
        page: 1,
        score: 99.5,
      };
      const result = parseObjectToQueryParams(obj);
      expect(result).toContain("page=1");
      expect(result).toContain("limit=10");
      expect(result).toContain("score=99.5");
    });

    it("should URL encode special characters", () => {
      const obj = {
        email: "test@example.com",
        search: "hello world",
      };
      const result = parseObjectToQueryParams(obj);
      expect(result).toContain("hello+world");
      expect(result).toContain("test%40example.com");
    });

    it("should handle zero and empty string (not as valid query params)", () => {
      const obj = {
        count: 0,
        name: "",
      };
      const result = parseObjectToQueryParams(obj);
      // 0 and empty string are kept by removeFalseOrNullProperties
      expect(result).toBe("count=0&name=");
    });

    it("should keep true boolean values", () => {
      const obj = {
        active: true,
      };
      const result = parseObjectToQueryParams(obj);
      expect(result).toContain("active=true");
    });
  });

  describe("removeFalseOrNullProperties()", () => {
    it("should remove false, null, and undefined properties", () => {
      const obj = {
        active: false,
        email: null,
        name: "John",
        phone: undefined,
      };
      const result = removeFalseOrNullProperties(obj);
      expect(result).toEqual({ name: "John" });
      expect(result).not.toHaveProperty("active");
      expect(result).not.toHaveProperty("email");
      expect(result).not.toHaveProperty("phone");
    });

    it("should keep truthy values", () => {
      const obj = {
        active: true,
        count: 0,
        empty: "",
        name: "John",
      };
      const result = removeFalseOrNullProperties(obj);
      // 0, "", true are kept (only false, null, undefined removed)
      expect(result).toEqual({
        active: true,
        count: 0,
        empty: "",
        name: "John",
      });
    });

    it("should handle empty object", () => {
      const result = removeFalseOrNullProperties({});
      expect(result).toEqual({});
    });
  });

  describe("capitalizeFirstLetter()", () => {
    it("should capitalize first letter", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter("HELLO")).toBe("HELLO");
    });

    it("should handle single character", () => {
      expect(capitalizeFirstLetter("a")).toBe("A");
    });

    it("should handle empty string", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });
  });

  describe("getFirstLetter()", () => {
    it("should return first letter of first word", () => {
      expect(getFirstLetter("John Doe")).toBe("J");
      expect(getFirstLetter("apple")).toBe("A");
    });

    it("should handle whitespace", () => {
      expect(getFirstLetter("  hello world")).toBe("H");
    });

    it("should return empty string if no words", () => {
      expect(getFirstLetter("   ")).toBe("");
    });
  });

  describe("getFirstWord()", () => {
    it("should return first word", () => {
      expect(getFirstWord("John Doe")).toBe("John");
      expect(getFirstWord("hello world")).toBe("hello");
    });

    it("should handle whitespace", () => {
      expect(getFirstWord("  hello world")).toBe("hello");
    });

    it("should return empty string for empty input", () => {
      expect(getFirstWord("")).toBe("");
    });
  });

  describe("transformSingular()", () => {
    it("should transform plural to singular (Portuguese)", () => {
      expect(transformSingular("pães", 1)).toBe("pãe");
      expect(transformSingular("casas", 1)).toBe("casa");
      expect(transformSingular("flores", 1)).toBe("flor");
      expect(transformSingular("homens", 1)).toBe("homem");
      expect(transformSingular("eleições", 1)).toBe("eleição");
    });

    it("should not transform if quantity is not 1", () => {
      expect(transformSingular("casas", 2)).toBe("casas");
      expect(transformSingular("flores", 0)).toBe("flores");
    });

    it("should handle words ending with ão", () => {
      expect(transformSingular("coração", 1)).toBe("coração");
    });
  });

  describe("feetToMeter()", () => {
    it("should convert feet to meter", () => {
      const result = feetToMeter(10);
      expect(result).toBe(3);
    });

    it("should handle non-finite numbers", () => {
      expect(feetToMeter(Infinity)).toBe(Infinity);
      expect(feetToMeter(NaN)).toBe(NaN);
    });
  });

  describe("meterToFeet()", () => {
    it("should convert meter to feet", () => {
      const result = meterToFeet(3);
      expect(result).toBe(10);
    });

    it("should handle non-finite numbers", () => {
      expect(meterToFeet(Infinity)).toBe(Infinity);
      expect(meterToFeet(NaN)).toBe(NaN);
    });
  });

  describe("sliceString()", () => {
    it("should return string if within limit", () => {
      const input = "Hello World";
      expect(sliceString(input, 20)).toBe("Hello World");
    });

    it("should slice string and add ellipsis if over limit", () => {
      const input = "This is a very long string";
      const result = sliceString(input, 10);
      expect(result).toBe("This is a ...");
    });

    it("should use default limit of 150", () => {
      const input = "a".repeat(200);
      const result = sliceString(input);
      expect(result).toBe("a".repeat(150) + "...");
    });

    it("should handle empty string", () => {
      expect(sliceString("")).toBe("");
    });
  });

  describe("addPlus()", () => {
    it("should add plus sign to positive numbers", () => {
      expect(addPlus(5)).toBe("+5");
      expect(addPlus(100)).toBe("+100");
    });

    it("should keep negative numbers as is", () => {
      expect(addPlus(-5)).toBe("-5");
    });

    it("should handle zero", () => {
      expect(addPlus(0)).toBe("0");
    });
  });

  describe("numberToWeight()", () => {
    it("should format weight with Kg unit", () => {
      expect(numberToWeight(75)).toBe("75 Kg");
    });

    it("should return 0 Kg if no value provided", () => {
      expect(numberToWeight()).toBe("0 Kg");
    });

    it("should handle zero", () => {
      expect(numberToWeight(0)).toBe("0 Kg");
    });
  });
});
