import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Comment,
  Container,
  Form,
  Header,
  List,
  ListItem,
  TextArea,
} from "semantic-ui-react";
import Markdown from "react-markdown";
import { ChatService } from "src/services/chat/chat.service";
import { defaultCatch } from "src/services/sonamu.shared";
import { UserService } from "src/services/user/user.service";
import { Message } from "src/services/chat/chat.types";
import { AssistantService } from "src/services/assistant/assistant.service";
import { Assistant } from "src/services/assistant/assistant.types";

export default function PublicIndexPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedAsst, setSelectedAsst] = useState<Assistant | null>(null);

  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = UserService.useMe();
  const { data: assistants, isLoading: isAssistantLoading } =
    AssistantService.useList();

  const { data, isLoading } = ChatService.useChatList();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = () => {
    if (inputValue.trim() !== "") {
      ChatService.chat({ content: inputValue })
        .then((res) => {
          setInputValue("");
          setMessages(res);
        })
        .catch(defaultCatch);
    }
  };

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      navigate("/login", { state: { from: "/" } });
    }
  }, [user, isUserLoading]);

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Header as="h2">Chat App</Header>
      <List class="assistant-list">
        {assistants?.map((assistant, index) => (
          <List.Item
            key={index}
            className={`assistant-item ${
              selectedAsst?.id === assistant.id ? "selected-assistant" : ""
            }`}
            onClick={() => setSelectedAsst(assistant)}
          >
            <List.Content>
              <List.Header>{assistant.name}</List.Header>
              <List.Description>
                <div>{assistant.description}</div>
                <div>{assistant.model}</div>
              </List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
      <Comment.Group style={{ maxWidth: "500px" }} className="chat-list">
        {messages?.map((chat, index) => (
          <Comment key={index} className={`chat-item ${chat.user ? "me" : ""}`}>
            <Comment.Content>
              <Comment.Text>
                <Markdown>{chat.content}</Markdown>
              </Comment.Text>
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
