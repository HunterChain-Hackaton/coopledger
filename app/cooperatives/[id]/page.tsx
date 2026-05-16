import CooperativePublicPage from '@/components/public/CooperativePublicPage';
export default function CoopPage({ params }: { params: { id: string } }) {
  return <CooperativePublicPage coopId={Number(params.id)} />;
}