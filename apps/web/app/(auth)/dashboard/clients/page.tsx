import MainPageWrapper from '@/components/layout/main-page-wrapper';
import ClientsContent from './components/content';

type Props = {};

export default function ClientPage({}: Props) {
    return (
        <MainPageWrapper title="Client Management">
            <ClientsContent />
        </MainPageWrapper>
    );
}
