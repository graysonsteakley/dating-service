import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const RoomPage = () => {
  const { query } = useRouter();
  const roomId = query.roomId as string;
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  return <div>Welcome to room {roomId}</div>;
};

export default RoomPage;
