import { expect } from "chai";
import DB2Dialect from "../../src";

describe("IBMi Client", () => {
  let client: DB2Dialect;

  beforeEach(() => {
    client = new DB2Dialect({ client: "ibmi" });
  });

  it("can be initialized with just the client name in config", () => {
    expect(new DB2Dialect({ client: "ibmi" })).to.exist;
  });

  describe("Bigint normalization", () => {
    it("normalizes bigint values to strings by default", () => {
      const queryObject: any = {
        sqlMethod: "select",
        response: {
          rows: [
            {
              id: 9007199254740995n,
              nested: { value: 1n },
              label: "example",
            },
          ],
          rowCount: 1,
        },
      };

      const result = client.processResponse(queryObject, {});

      expect(result).to.deep.equal([
        {
          id: "9007199254740995",
          nested: { value: "1" },
          label: "example",
        },
      ]);
    });

    it("can disable bigint normalization via configuration", () => {
      const customClient = new DB2Dialect({
        client: "ibmi",
        ibmi: { normalizeBigintToString: false },
      } as any);

      const queryObject: any = {
        sqlMethod: "select",
        response: {
          rows: [{ id: 42n }],
          rowCount: 1,
        },
      };

      const result = customClient.processResponse(queryObject, {});

      expect(typeof result[0].id).to.equal("bigint");
    });
  });
});
