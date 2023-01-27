import { JSX } from "solid-js";
import type { Component } from "solid-js";
import { A } from "@solidjs/router";

const Landing: Component = (): JSX.Element => {
  return (
    <>
      <h1>Solid.js Basics</h1>
      <A href="/children-and-composition-example">Children and composition</A>
      <A href="/createSignal-example">createSignal example</A>
      <A href="/createSignal-map-example">createSignal map elements</A>
      <A href="/on-cleanup-example">onCleanup example</A>
      <A href="/resource-example">resource example</A>
      <A href="/ref-binding-example">Ref binding example</A>
    </>
  );
};

export default Landing;
