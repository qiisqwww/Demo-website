import dayjs from "dayjs";

export interface IListRefills {
  id: number;
  refill_id: number;
  time_end: dayjs.Dayjs | null;
  time_start: dayjs.Dayjs;
  user_id: number;
}
