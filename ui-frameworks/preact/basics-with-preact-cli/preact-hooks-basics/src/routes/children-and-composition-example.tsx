import { h } from "preact";

interface WrapperProps {
  color: string;
  children: JSX.Element | JSX.Element[];
}

const Wrapper = (props: WrapperProps): h.JSX.Element => {
  return (
    <div className={`super-important-class border-${props.color}`}>
      {props.children}
    </div>
  );
};

const WelcomeDialogue = (): h.JSX.Element => {
  return (
    <Wrapper color="gray">
      <h1>Welcome!</h1>
      <p>Thank you for visiting!</p>
    </Wrapper>
  );
};

export default WelcomeDialogue;
