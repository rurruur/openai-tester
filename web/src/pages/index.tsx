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
import { ThreadService } from "src/services/thread/thread.service";
import { Thread } from "src/services/thread/thread.types";

export default function PublicIndexPage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState<string>("");
  const [selectedAsst, setSelectedAsst] = useState<Assistant | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: user, isLoading: isUserLoading } = UserService.useMe();
  const { data: assistants, isLoading: isAssistantLoading } =
    AssistantService.useList();
  const { data: threads, isLoading: isThreadLoading } = ThreadService.useList();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleFormSubmit = () => {
    if (!selectedThread) {
      alert("Please select a thread.");
      return;
    }
    if (!selectedAsst) {
      alert("Please select an assistant.");
      return;
    }

    if (content.trim() !== "") {
      setLoading(true);
      ChatService.chat({
        content,
        threadId: selectedThread.id,
        assistantId: selectedAsst.id,
      })
        .then((res) => {
          setContent("");
          setMessages(res);
        })
        .catch(defaultCatch)
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      navigate("/login", { state: { from: "/" } });
    }
  }, [user, isUserLoading]);

  useEffect(() => {
    if (selectedThread) {
      ChatService.getChatList(selectedThread.id)
        .then((res) => {
          setMessages(res);
        })
        .catch(defaultCatch);
    }
  }, [selectedThread]);

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Header as="h2">Chat App</Header>
      <List class="assistant-list">
        {assistants?.map((assistant, index) => (
          <List.Item
            key={index}
            className={`assistant-item ${
              selectedAsst?.id === assistant.id ? "selected-item" : ""
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
      <div className="main">
        <List className="thread-list">
          {threads?.map((thread, index) => (
            <ListItem
              key={index}
              className={`thread-item ${
                selectedThread?.id === thread.id ? "selected-item" : ""
              }`}
              onClick={() => setSelectedThread(thread)}
            >
              <List.Content>
                <List.Header>{`채팅 ${index + 1}`}</List.Header>
                <List.Description>
                  <div>{thread.created_at}</div>
                </List.Description>
              </List.Content>
            </ListItem>
          ))}
        </List>
        <div className="chat">
          {selectedThread && (
            <>
              <List className="chat-list">
                {messages?.map((chat, index) => (
                  <List.Item
                    key={index}
                    className={`chat-item ${chat.user ? "me" : ""}`}
                  >
                    <List.Content>
                      <Markdown>{chat.content}</Markdown>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
              <Form reply onSubmit={handleFormSubmit}>
                <TextArea
                  value={content}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                />
                <Button
                  content="Send"
                  labelPosition="left"
                  icon="send"
                  primary
                  loading={loading || isThreadLoading || isAssistantLoading}
                />
              </Form>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
