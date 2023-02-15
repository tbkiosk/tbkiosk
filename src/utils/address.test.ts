import { describe, it, expect, test } from "vitest";

import { ellipsisMiddle } from "./address";

describe("address", () => {
  it("should not be omitted if its length is no more than 15 by default options", () => {
    const address = "abcdefg";
    const address15Chars = "abcdefghijklmno";

    expect(ellipsisMiddle(address)).equals(address);
    expect(ellipsisMiddle(address15Chars)).equals(address15Chars);
  });

  it("should be omitted if its length is more than 15 by default options", () => {
    const address = "abcdefghijklmnopqrstuvwxyz";
    const omittedAddress = "abcde...rstuvwxyz";
    const address16Chars = "abcdefghijklmnop";
    const omittedAddress16Chars = "abcde...hijklmnop";

    expect(ellipsisMiddle(address)).equals(omittedAddress);
    expect(ellipsisMiddle(address16Chars)).equals(omittedAddress16Chars);
  });

  test.fails("should throw error", () => {
    const address = "abcdefghijklmnopqrstuvwxyz";
    const wrongOptions1 = {
      minEllipsisLength: 5,
      startLength: 1,
      endLength: 4,
    };
    const wrongOptions2 = {
      minEllipsisLength: 5,
      startLength: 0,
      endLength: -1,
    };

    expect(ellipsisMiddle(address, wrongOptions1)).rejects.toThrow(
      new Error("Wrong ellipsis middle options")
    );
    expect(ellipsisMiddle(address, wrongOptions2)).rejects.toThrow(
      new Error("Wrong ellipsis middle options")
    );
  });
});
