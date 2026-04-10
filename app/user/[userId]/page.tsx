import { UserProfilePage } from "./UserProfilePage";

// 为静态导出生成参数
export async function generateStaticParams() {
  return [
    { userId: "1" },
    { userId: "2" },
    { userId: "3" },
    { userId: "4" },
    { userId: "5" },
  ];
}

export default function Page({ params }: { params: { userId: string } }) {
  return <UserProfilePage userId={params.userId} />;
}
