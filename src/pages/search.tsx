import type { NextPage } from "next";
import { api } from "../utils/api";

export const SearchPage: NextPage = () => {
  const { data, error, isLoading } = api.user.getAllUsers.useQuery();

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-200">
        <div className="flex justify-center gap-2 align-middle">
          <p>Loading...</p>
        </div>
      </main>
    );
  } else if (!!error?.message) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-200">
        <div className="flex justify-center gap-2 align-middle">
          <p>{error.message}</p>
        </div>
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-200">
        <div className="flex justify-center gap-2 align-middle">
          <pre className="flex justify-center whitespace-pre-wrap p-5 text-left align-middle">
            {JSON.stringify(data)}
          </pre>
        </div>
      </main>
    );
  }
};
export default SearchPage;
