interface Props {
  params: {
    id: string;
  };
}

export default function StudentClassPage({
  params,
}: Props) {
  return (
    <div>
      <h1>Student Classroom</h1>

      <p>Class ID: {params.id}</p>
    </div>
  );
}