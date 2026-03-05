export const pushMock = jest.fn();
export const replaceMock = jest.fn();

export function mockNextNavigation() {
  jest.mock("next/navigation", () => ({
    useRouter: () => ({
      push: pushMock,
      replace: replaceMock,
      refresh: jest.fn(),
    }),
    useParams: () => ({ id: "post-1" }),
  }));
}
