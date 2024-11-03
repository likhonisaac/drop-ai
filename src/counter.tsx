import { useEffect } from "react";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const connection = new MockConnection();
    connection.connect();
    connection.increment();
  }, [count]);
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Counter</h1>
      <p className="text-xl">Count: {count}</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
}

class MockConnection {
  static count = 0;
  constructor() {}

  connect() {
    console.log("Connected to server");
  }

  increment() {
    console.log("server increment to " + MockConnection.count);
    MockConnection.count++;
  }

  getCount() {
    return MockConnection.count;
  }

  disconnect() {
    console.log("Disconnected from server");
  }
}
