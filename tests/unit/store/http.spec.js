import http from "src/store/http";
import fetchMock from "fetch-mock";

describe("http wrapper", () => {
  const testUrl = "http://localhost/";

  afterEach(() => {
    fetchMock.restore();
  });

  it("should contain a post method", function() {
    expect(http.post).toBeDefined();
  });

  describe("post", () => {
    it.only("should call fetch with the correct args", async () => {
      const request = { req: "test" };
      const response = { resp: "test" };

      fetchMock.mock(testUrl, response);

      await http.post(testUrl, request);

      expect(fetchMock.calls().length).toBe(1);
      expect(fetchMock.lastOptions().body).toBe(JSON.stringify(request));
      expect(fetchMock.lastUrl()).toBe(testUrl);
    });

    it.only("throw an error when the fetch call fails", async () => {
      const response = 503;

      fetchMock.mock(testUrl, response);

      try {
        await http.post(testUrl);
      } catch (error) {
        expect(error.message).toBe("Service Unavailable");
      }
    });

    it.only("throw an error when the fetch call returns invalid json", async () => {
      const response = "dfas";

      fetchMock.mock(testUrl, response);

      try {
        await http.post(testUrl);
      } catch (error) {
        expect(error.message).toBe("Invalid response");
      }
    });

    // it('returns the response json for a valid response', function () {
    //   const response = validResponseStub;
    //   const url = 'example.com';
    //
    //   global.fetch.mockResolvedValue({
    //     ok: true,
    //     body
    //   });
    //
    //   http.post(url, payload);
    //
    //   expect(global.fetch).toHaveBeenCalledWith(url, {
    //     ...http.postOptions,
    //     body: JSON.stringify(payload)
    //   });
    // });
  });
});
