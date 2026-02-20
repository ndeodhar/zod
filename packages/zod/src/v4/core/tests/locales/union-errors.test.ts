import { expect, test } from "vitest";
import * as z from "zod/v4";

test("Union error messages - literals", () => {
  // Test union of two string literals
  const twoLiterals = z.union([z.literal("a"), z.literal("b")]);
  const result1 = twoLiterals.safeParse("c");
  expect(result1.success).toBe(false);
  if (!result1.success) {
    expect(result1.error.issues[0].message).toBe('Invalid input: expected one of "a", "b", but received "c"');
  }

  // Test union of three string literals
  const threeLiterals = z.union([z.literal("red"), z.literal("green"), z.literal("blue")]);
  const result2 = threeLiterals.safeParse("yellow");
  expect(result2.success).toBe(false);
  if (!result2.success) {
    expect(result2.error.issues[0].message).toBe(
      'Invalid input: expected one of "red", "green", "blue", but received "yellow"'
    );
  }

  // Test union of numeric literals
  const numericLiterals = z.union([z.literal(1), z.literal(2), z.literal(3)]);
  const result3 = numericLiterals.safeParse(4);
  expect(result3.success).toBe(false);
  if (!result3.success) {
    expect(result3.error.issues[0].message).toBe("Invalid input: expected one of 1, 2, 3, but received 4");
  }

  // Test union with boolean literals
  const booleanLiterals = z.union([z.literal(true), z.literal(false)]);
  const result4 = booleanLiterals.safeParse("true");
  expect(result4.success).toBe(false);
  if (!result4.success) {
    expect(result4.error.issues[0].message).toBe('Invalid input: expected one of true, false, but received "true"');
  }

  // Test union in nested object
  const schema = z.object({
    type: z.union([z.literal("a"), z.literal("b")]),
  });
  const result5 = schema.safeParse({ type: "c" });
  expect(result5.success).toBe(false);
  if (!result5.success) {
    expect(result5.error.issues[0].message).toBe('Invalid input: expected one of "a", "b", but received "c"');
    expect(result5.error.issues[0].path).toEqual(["type"]);
  }
});

test("Union error messages - mixed types (fallback to generic message)", () => {
  // Union of string and number types should use generic message
  const mixedUnion = z.union([z.string(), z.number()]);
  const result1 = mixedUnion.safeParse(true);
  expect(result1.success).toBe(false);
  if (!result1.success) {
    expect(result1.error.issues[0].message).toBe("Invalid input");
  }

  // Union with object should use generic message
  const objectUnion = z.union([z.object({ name: z.string() }), z.number()]);
  const result2 = objectUnion.safeParse("test");
  expect(result2.success).toBe(false);
  if (!result2.success) {
    expect(result2.error.issues[0].message).toBe("Invalid input");
  }

  // Union with literal and type should use generic message
  const mixedLiteralUnion = z.union([z.literal("a"), z.number()]);
  const result3 = mixedLiteralUnion.safeParse(true);
  expect(result3.success).toBe(false);
  if (!result3.success) {
    expect(result3.error.issues[0].message).toBe("Invalid input");
  }
});

test("Union error messages - mixed literal types", () => {
  // Union of string and number literals
  const mixedLiterals = z.union([z.literal("a"), z.literal("b"), z.literal(1), z.literal(2)]);
  const result1 = mixedLiterals.safeParse("c");
  expect(result1.success).toBe(false);
  if (!result1.success) {
    expect(result1.error.issues[0].message).toBe('Invalid input: expected one of "a", "b", 1, 2, but received "c"');
  }

  const result2 = mixedLiterals.safeParse(3);
  expect(result2.success).toBe(false);
  if (!result2.success) {
    expect(result2.error.issues[0].message).toBe('Invalid input: expected one of "a", "b", 1, 2, but received 3');
  }
});
