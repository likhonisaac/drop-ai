export interface ClientTask {
  title: string;
  description: string;
  requester: string;
  completed: boolean;
  location: string;
  timeEstimate: number;
  sizeEstimate: string;
}

export interface Task extends ClientTask {
  _id: string;
  // in milliseconds
  _creationTime: number;
  answer: string;
}
