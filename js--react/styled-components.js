// ------------
// styled components
// ------------

// install 
`
npm i --save styled-components
`

// ------------
// hello world
// ------------

import React from 'react';
import styled from 'styled-components';

const App = () => {
  // title component
  const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
  `;
  // wrapper component
  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;

  return (
    <Wrapper>
      <Title>
        Hello World!
      </Title>
    </Wrapper>
  )
}

export default App;

// ------------
// using props
// ------------

import React from 'react';
import styled from 'styled-components';

const App = () => {
  // styled button
  const Button = styled.button`
    /* Adapt the colors based on primary prop */
    background: ${props => props.primary ? "palevioletred" : "white"};
    color: ${props => props.primary ? "white" : "palevioletred"};
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
  `;
  // jsx
  return (
    <div>
      <Button>Normal</Button>
      <Button primary>Primary</Button>
    </div>
  );
}

export default App;

// ------------
// extending styles
// ------------

import React from 'react';
import styled from 'styled-components';

const App = () => {
  // button component
  const Button = styled.button`
    color: palevioletred;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
  `;
  // button component (with extended styles)
  const TomatoButton = styled(Button)`
    color: tomato;
    border-color: tomato;
  `;
  return (
    <div>
      <Button>Normal Button</Button>
      <TomatoButton>Tomato Button</TomatoButton>
    </div>
  );
}

export default App;

// ------------
// "as" polymorphic prop
// ------------

// button --> a

import React from 'react';
import styled from 'styled-components';

const App = () => {
  // styled button
  const Button = styled.button`
    display: inline-block;
    color: palevioletred;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
    display: block;
  `;
  // styled button (extended styles)
  const TomatoButton = styled(Button)`
    color: tomato;
    border-color: tomato;
  `;
  // jsx
  return (
    <div>
      <Button>Normal Button</Button>
      <Button as="a" href="/">Link with Button styles</Button>
      <TomatoButton as="a" href="/">Link with Tomato Button styles</TomatoButton>
    </div>
  );
}

export default App;

// ------------
// customize children
// ------------

import React from 'react';
import styled from 'styled-components';

const App = () => {
  // regular button
  const Button = styled.button`
    display: inline-block;
    color: palevioletred;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
    display: block;
  `;
  // button with customized children
  const ReversedButton = props => <Button {...props} children={props.children.split('').reverse()} />
  // jsx
  return (
    <div>
      <Button>Normal Button</Button>
      <Button as={ReversedButton}>Custom Button with Normal Button styles</Button>
    </div>
  );
}

export default App;

// ------------
// styling any component
// ------------

// 'styled' method works on components that pass 'className' prop to a DOM element

import React from 'react';
import styled from 'styled-components';

const App = () => {
  // link component
  const Link = ({ className, children, href }) => (
    <a href={href} className={className}>{children}</a>
  );
  // styled link component
  const StyledLink = styled(Link)`
    color: palevioletred;
    font-weight: bold;
    text-decoration: inherit;
  `;
  // jsx
  return (
    <div>
      <Link href="http://www.google.com">Unstyled, boring Link</Link>
      <br />
      <StyledLink href="http://www.google.com">Styled, exciting Link</StyledLink>
    </div>
  );
};

export default App;

// ------------
// passed props
// ------------

// styled target
  // simple element -- styled-components passes through any known HTML attributes
  // react component -- passes through all props

// ------------
// pseudoelements, pseudoselectors, nesting
// ------------

// docs
  // https://styled-components.com/docs/basics#pseudoelements-pseudoselectors-and-nesting

// stylies -- SC's preprocessor that supports scss-like syntax for nesting styles.

import React from 'react';
import styled from 'styled-components';

const App = () => {
  // styled component
  const Thing = styled.div.attrs((/* props */) => ({ tabIndex: 0 }))`
    color: blue;

    &:hover {
      color: red; // <Thing> when hovered
    }

    & ~ & {
      background: tomato; // <Thing> as a sibling of <Thing>, but maybe not directly next to it
    }

    & + & {
      background: lime; // <Thing> next to <Thing>
    }

    &.something {
      background: orange; // <Thing> tagged with an additional CSS class ".something"
    }

    .something-else & {
      border: 1px solid; // <Thing> inside another element labeled ".something-else"
    }
  `;
  // jsx
  return (
    <React.Fragment>
      <Thing>Hello world!</Thing>
      <Thing>How ya doing?</Thing>
      <Thing className="something">The sun is shining...</Thing>
      <div>Pretty nice day today.</div>
      <Thing>Don't you think?</Thing>
      <div className="something-else">
        <Thing>Splendid.</Thing>
      </div>
    </React.Fragment>
  )
}

export default App;

// ------------
// attaching additional props
// ------------

import React from 'react';
import styled from 'styled-components';

const App = () => {
  // styled input
  const Input = styled.input.attrs(props => ({
    // we can define static props
    type: "password",
    // or we can define dynamic ones
    size: props.size || "1em",
  }))`
    color: palevioletred;
    font-size: 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
    /* here we use the dynamically computed prop */
    margin: ${props => props.size};
    padding: ${props => props.size};
  `;
  // jsx
  return (
    <div>
      <Input placeholder="A small text input" />
      <br />
      <Input placeholder="A bigger text input" size="2em" />
    </div>
  );
}

export default App;

// ------------
// animations
// ------------

import React from 'react';
import styled, { keyframes } from 'styled-components';

const App = () => {
  // Create the keyframes
  const rotate = keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `;

  // Here we create a component that will rotate everything we pass in over two seconds
  const RotatingComponent = styled.div`
    display: inline-block;
    animation: ${rotate} 2s linear infinite;
    padding: 2rem 1rem;
    font-size: 1.2rem;
  `;

  return (
    <RotatingComponent>&lt; 💅 &gt;</RotatingComponent>
  );
}

export default App;

// ------------
// theming
// ------------

import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

const App = () => {
  // styled button (uses props.theme)
  const Button = styled.button`
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border-radius: 3px;

    /* Color the border and text with theme.main */
    color: ${props => props.theme.main};
    border: 2px solid ${props => props.theme.main};
  `;
  // default theme for buttons that aren't wrapped in the ThemeProvider
  Button.defaultProps = {
    theme: {
      main: "palevioletred"
    }
  }
  // define props.theme
  const theme = {
    main: "mediumseagreen"
  };

  return (
    <div>
      <Button>Normal</Button>
      <ThemeProvider theme={theme}>
        <Button>Themed</Button>
      </ThemeProvider>
    </div>
  );
}

export default App;

// ------------
// function themes
// ------------

import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

const App = () => {
  // Define our button, but with the use of props.theme this time
  const Button = styled.button`
    color: ${props => props.theme.fg};
    border: 2px solid ${props => props.theme.fg};
    background: ${props => props.theme.bg};
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border-radius: 3px;
  `;
  // theme (propeties: fg, bg)
  const theme = {
    fg: "palevioletred",
    bg: "white"
  };
  // function theme -- swaps fg and bg
  const invertTheme = ({ fg, bg }) => ({
    fg: bg,
    bg: fg
  });
  // jsx
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Button>Default Theme</Button>
        <ThemeProvider theme={invertTheme}>
          <Button>Inverted Theme</Button>
        </ThemeProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;

// ------------
// withTheme (HOC)
// ------------

// https://styled-components.com/docs/advanced#getting-the-theme-without-styled-components

import React from 'react';
import styled, { withTheme } from 'styled-components';

const App = (props) => {
  console.log(props.theme);
  return (
    <div>
      {/* ... */}
    </div>
  )
}

export default withTheme(App);

// ------------
// useContext (hook)
// ------------

import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

const App = () => {
  const themeContext = useContext(ThemeContext);
  console.log(themeContext);
  return (
    <div>
      {/* ... */}
    </div>
  )
}


// ------------
// SSR
// ------------

// https://styled-components.com/docs/advanced#server-side-rendering

// ------------
// style objects
// ------------

// https://styled-components.com/docs/advanced#style-objects

// ------------
// api reference
// ------------

// https://styled-components.com/docs/api

// *** START HERE ***

// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




