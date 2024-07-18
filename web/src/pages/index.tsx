import React, { useState } from "react";
import {
  Button,
  Comment,
  Container,
  Form,
  Header,
  TextArea,
} from "semantic-ui-react";

type Message = {
  content: string;
  isUser: boolean;
};

export default function PublicIndexPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = () => {
    if (inputValue.trim() !== "") {
      const newMessage: Message = {
        content: inputValue,
        isUser: true, // Flag to determine if the message is sent by user
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Header as="h2">Chat App</Header>
      <Comment.Group style={{ maxWidth: "500px" }}>
        {messages.map((message, index) => (
          <Comment key={index} textAlign={message.isUser ? "right" : "left"}>
            <Comment.Content>
              <Comment.Text>{message.content}</Comment.Text>
            </Comment.Content>
          </Comment>
        ))}
      </Comment.Group>
      <Form reply onSubmit={handleFormSubmit} style={{ marginTop: "1rem" }}>
        <TextArea
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <Button content="Send" labelPosition="left" icon="send" primary />
      </Form>
    </Container>
  );
}
