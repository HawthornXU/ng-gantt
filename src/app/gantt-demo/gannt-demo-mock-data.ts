import { GanttChartConfig } from '../../../component/gantt-chart';

const CURRENT_YEAR = new Date().getFullYear()

export const GANTT_MOCK_DATA_BASIC = [
  {
    id: '1',
    startDate: new Date(CURRENT_YEAR, 0, 20),
    endDate: new Date(CURRENT_YEAR, 0, 20),
    type: GanttChartConfig.TASK_TYPE.Normal
  },
  {
    id: '2',
    startDate: new Date(CURRENT_YEAR, 0, 21),
    endDate: new Date(CURRENT_YEAR, 0, 26),
    type: GanttChartConfig.TASK_TYPE.Abstract
  },
  {
    id: '3',
    startDate: new Date(CURRENT_YEAR, 0, 21),
    endDate: new Date(CURRENT_YEAR, 0, 21),
    type: GanttChartConfig.TASK_TYPE.Normal
  },
  {
    id: '4',
    startDate: new Date(CURRENT_YEAR, 0, 22),
    endDate: new Date(CURRENT_YEAR, 0, 22),
    type: GanttChartConfig.TASK_TYPE.Milestone
  },
  {
    id: '5',
    startDate: new Date(CURRENT_YEAR, 0, 22),
    endDate: new Date(CURRENT_YEAR, 0, 26),
    type: GanttChartConfig.TASK_TYPE.Abstract
  },
  {
    id: '6',
    startDate: new Date(CURRENT_YEAR, 0, 22),
    endDate: new Date(CURRENT_YEAR, 0, 22),
    type: GanttChartConfig.TASK_TYPE.Normal
  },
  {
    id: '7',
    startDate: new Date(CURRENT_YEAR, 0, 25),
    endDate: new Date(CURRENT_YEAR, 0, 25),
    type: GanttChartConfig.TASK_TYPE.Normal
  },
  {
    id: '8',
    startDate: new Date(CURRENT_YEAR, 0, 26),
    endDate: new Date(CURRENT_YEAR, 0, 26),
    type: GanttChartConfig.TASK_TYPE.Normal
  },
  {
    id: '9',
    startDate: new Date(CURRENT_YEAR, 0, 27),
    endDate: new Date(CURRENT_YEAR, 1, 2),
    type: GanttChartConfig.TASK_TYPE.Abstract
  },
  {
    id: '10',
    startDate: new Date(CURRENT_YEAR, 0, 27),
    endDate: new Date(CURRENT_YEAR, 0, 27),
    type: GanttChartConfig.TASK_TYPE.Normal
  },
  {
    id: '11',
    startDate: new Date(CURRENT_YEAR, 0, 28),
    endDate: new Date(CURRENT_YEAR, 0, 28),
    type: GanttChartConfig.TASK_TYPE.Normal
  },
  {
    id: '12',
    startDate: new Date(CURRENT_YEAR, 0, 29),
    endDate: new Date(CURRENT_YEAR, 0, 29),
    type: GanttChartConfig.TASK_TYPE.Normal
  }, {
    id: '13',
    startDate: new Date(CURRENT_YEAR, 1, 1),
    endDate: new Date(CURRENT_YEAR, 1, 1),
    type: GanttChartConfig.TASK_TYPE.Normal
  }, {
    id: '14',
    startDate: new Date(CURRENT_YEAR, 1, 2),
    endDate: new Date(CURRENT_YEAR, 1, 2),
    type: GanttChartConfig.TASK_TYPE.Normal
  }, {
    id: '15',
    startDate: new Date(CURRENT_YEAR, 1, 3),
    endDate: new Date(CURRENT_YEAR, 1, 9),
    type: GanttChartConfig.TASK_TYPE.Abstract
  }, {
    id: '16',
    startDate: new Date(CURRENT_YEAR, 1, 3),
    endDate: new Date(CURRENT_YEAR, 1, 3),
    type: GanttChartConfig.TASK_TYPE.Normal
  }, {
    id: '17',
    startDate: new Date(CURRENT_YEAR, 1, 4),
    endDate: new Date(CURRENT_YEAR, 1, 4),
    type: GanttChartConfig.TASK_TYPE.Normal
  }, {
    id: '18',
    startDate: new Date(CURRENT_YEAR, 1, 5),
    endDate: new Date(CURRENT_YEAR, 1, 9),
    type: GanttChartConfig.TASK_TYPE.Abstract
  }, {
    id: '19',
    startDate: new Date(CURRENT_YEAR, 1, 5),
    endDate: new Date(CURRENT_YEAR, 1, 5),
    type: GanttChartConfig.TASK_TYPE.Normal
  }, {
    id: '20',
    startDate: new Date(CURRENT_YEAR, 1, 8),
    endDate: new Date(CURRENT_YEAR, 1, 8),
    type: GanttChartConfig.TASK_TYPE.Normal
  }, {
    id: '21',
    startDate: new Date(CURRENT_YEAR, 1, 9),
    endDate: new Date(CURRENT_YEAR, 1, 9),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '22',
    startDate: new Date(CURRENT_YEAR, 1, 10),
    endDate: new Date(CURRENT_YEAR, 1, 16),
    type: GanttChartConfig.TASK_TYPE.Abstract
  }, {
    id: '23',
    startDate: new Date(CURRENT_YEAR, 1, 10),
    endDate: new Date(CURRENT_YEAR, 1, 11),
    type: GanttChartConfig.TASK_TYPE.Abstract
  },{
    id: '24',
    startDate: new Date(CURRENT_YEAR, 1, 10),
    endDate: new Date(CURRENT_YEAR, 1, 10),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '25',
    startDate: new Date(CURRENT_YEAR, 1, 11),
    endDate: new Date(CURRENT_YEAR, 1, 11),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '26',
    startDate: new Date(CURRENT_YEAR, 1, 12),
    endDate: new Date(CURRENT_YEAR, 1, 16),
    type: GanttChartConfig.TASK_TYPE.Abstract
  },{
    id: '27',
    startDate: new Date(CURRENT_YEAR, 1, 12),
    endDate: new Date(CURRENT_YEAR, 1, 15),
    type: GanttChartConfig.TASK_TYPE.Abstract
  },{
    id: '28',
    startDate: new Date(CURRENT_YEAR, 1, 12),
    endDate: new Date(CURRENT_YEAR, 1, 12),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '29',
    startDate: new Date(CURRENT_YEAR, 1, 15),
    endDate: new Date(CURRENT_YEAR, 1, 15),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '30',
    startDate: new Date(CURRENT_YEAR, 1, 16),
    endDate: new Date(CURRENT_YEAR, 1, 16),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '31',
    startDate: new Date(CURRENT_YEAR, 1, 17),
    endDate: new Date(CURRENT_YEAR, 1, 25),
    type: GanttChartConfig.TASK_TYPE.Abstract
  },{
    id: '32',
    startDate: new Date(CURRENT_YEAR, 1, 17),
    endDate: new Date(CURRENT_YEAR, 1, 17),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '32',
    startDate: new Date(CURRENT_YEAR, 1, 18),
    endDate: new Date(CURRENT_YEAR, 1, 18),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '32',
    startDate: new Date(CURRENT_YEAR, 1, 19),
    endDate: new Date(CURRENT_YEAR, 1, 19),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '32',
    startDate: new Date(CURRENT_YEAR, 1, 22),
    endDate: new Date(CURRENT_YEAR, 1, 22),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '32',
    startDate: new Date(CURRENT_YEAR, 1, 23),
    endDate: new Date(CURRENT_YEAR, 1, 23),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '32',
    startDate: new Date(CURRENT_YEAR, 1, 24),
    endDate: new Date(CURRENT_YEAR, 1, 24),
    type: GanttChartConfig.TASK_TYPE.Normal
  },{
    id: '32',
    startDate: new Date(CURRENT_YEAR, 1, 25),
    endDate: new Date(CURRENT_YEAR, 1, 25),
    type: GanttChartConfig.TASK_TYPE.Normal
  },
]
