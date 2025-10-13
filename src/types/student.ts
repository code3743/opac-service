export interface StudentBookTransaction {
  identifier: string;
  title: string;
  location: string;
  transactionType?: string;
  date: string;
  fine?: number;
}

export interface Program {
  code: string;
  name: string;
}


export interface StudentProfile {
  code: string;
  firstName: string;
  fullName: string;
  programs: Program[];
  fine: number;
  location: string;
}
