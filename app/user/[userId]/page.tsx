import { UserProfilePage } from "./UserProfilePage";

// 为静态导出生成参数
export async function generateStaticParams() {
  return [
    { userId: "user1" },
    { userId: "user2" },
    { userId: "user3" },
    { userId: "user4" },
  ];
}

export default function Page({ params }: { params: { userId: string } }) {
  return <UserProfilePage userId={params.userId} />;
}
