interface Props {
  params: {
    id: string;
  };
}

export default function ClassPage({
  params,
}: Props) {
  return (
    <div>
      <h1>Teacher Classroom</h1>

      <p>Class ID: {params.id}</p>
    </div>
  );
}