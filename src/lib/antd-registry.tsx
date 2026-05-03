"use client";

import React, { useRef } from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { useServerInsertedHTML } from "next/navigation";

export function AntdRegistry({ children }: { children: React.ReactNode }) {
  const cache = useRef<Entity>(createCache());

  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache.current, true) }}
    />
  ));

  return (
    <StyleProvider cache={cache.current} hashPriority="high">
      {children}
    </StyleProvider>
  );
}
