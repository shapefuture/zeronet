export function RenderedSchemaComponent({ schema }: { schema: any }) {
  if (!schema) return null;
  const { type, props, children } = schema;
  const Tag = type as keyof JSX.IntrinsicElements;
  return <Tag {...props}>
    {children && children.map((child: any, idx: number) => (
      <RenderedSchemaComponent key={idx} schema={child} />
    ))}
  </Tag>;
}