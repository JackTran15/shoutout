import { useMessages } from "../../hooks/useMessages";

export function Dashboard() {
  const messages = useMessages();
  console.log("re-render");

  if (messages.isLoading) return <h1>Loading...</h1>;
  return (
    <div>
      <h1>Chat</h1>
      <button onClick={() => messages.refetch()}>Reload</button>
    </div>
  );
}
