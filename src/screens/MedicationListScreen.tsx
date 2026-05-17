import { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { MedicationListItem } from '../components/MedicationListItem';
import { MedicationSummaryCard } from '../components/MedicationSummaryCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusFilterTabs } from '../components/StatusFilterTabs';
import { StatusLegend } from '../components/StatusLegend';
import {
  MedicationListFilter,
  useMedicationList,
} from '../hooks/useMedicationList';
import { Routes } from '../navigation/routes';
import { useAppNavigation } from '../navigation/useAppNavigation';

export function MedicationListScreen() {
  const navigation = useAppNavigation();
  const [filter, setFilter] = useState<MedicationListFilter>('all');
  const { items, summary } = useMedicationList(filter);

  return (
    <ScreenContainer>
      <AppHeader
        title="Agenda completa de hoje"
        subtitle="Veja todos os medicamentos do dia e filtre por status. Toque em um item para abrir os detalhes."
        onBack={() => navigation.goBack()}
      />

      <MedicationSummaryCard
        summary={summary}
        note="Considera todos os medicamentos de hoje, independente do filtro selecionado."
      />

      <StatusFilterTabs value={filter} onChange={setFilter} />

      {items.length === 0 ? (
        <EmptyState
          title={getEmptyTitle(filter)}
          message={getEmptyMessage(filter)}
        />
      ) : (
        <Card>
          {items.map((item, index) => (
            <MedicationListItem
              key={item.id}
              item={item}
              showDivider={index > 0}
              onPress={(tapped) =>
                navigation.navigate(Routes.MedicationDetail, {
                  logId: tapped.id,
                })
              }
            />
          ))}
        </Card>
      )}

      <StatusLegend />
    </ScreenContainer>
  );
}

function getEmptyTitle(filter: MedicationListFilter): string {
  switch (filter) {
    case 'pending':
      return 'Nenhum medicamento pendente';
    case 'taken':
      return 'Nenhum medicamento marcado como tomado';
    case 'late':
      return 'Nenhum medicamento atrasado';
    case 'all':
    default:
      return 'Nenhum medicamento agendado';
  }
}

function getEmptyMessage(filter: MedicationListFilter): string {
  switch (filter) {
    case 'pending':
      return 'Você não tem medicamentos pendentes neste momento.';
    case 'taken':
      return 'Você ainda não marcou medicamentos como tomados hoje.';
    case 'late':
      return 'Você não tem medicamentos atrasados. Continue assim!';
    case 'all':
    default:
      return 'Não há medicamentos agendados para hoje.';
  }
}
