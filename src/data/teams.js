/**
 * Specialist teams an operator can escalate to.
 * `capacity` is mock on-call staffing shown as a hint in the escalation modal.
 */
export const teams = [
  {
    id: 'noc',
    name: 'NOC',
    nameJa: 'ネットワーク運用',
    description: 'Backbone & transport operations · Tokyo/Osaka',
    capacity: { onCall: 3, total: 5 },
  },
  {
    id: 'security',
    name: 'Security',
    nameJa: 'セキュリティ',
    description: 'CSIRT · incident response & DDoS mitigation',
    capacity: { onCall: 1, total: 3 },
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    nameJa: 'インフラ',
    description: 'Data center, power & facilities · Telehouse',
    capacity: { onCall: 2, total: 4 },
  },
];

export const getTeam = (id) => teams.find((t) => t.id === id);
