import { useTypeForm } from "@sonamu-kit/react-sui";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Form, FormInput, Header } from "semantic-ui-react";
import { defaultCatch } from "src/services/sonamu.shared";
import { UserService } from "src/services/user/user.service";
import { UserLoginParams } from "src/services/user/user.types";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { form, setForm, register } = useTypeForm(UserLoginParams, {
    name: "",
  });

  const handleLogin = () => {
    UserService.login(form)
      .then((res) => {
        navigate(location.state?.from ?? "/");
      })
      .catch(defaultCatch);
  };

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Header as="h2">Login</Header>
      <Form>
        <Form.Field>
          <label>Name</label>
          <FormInput type="text" {...register("name")} />
        </Form.Field>
        <Button type="submit" primary onClick={handleLogin}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}
