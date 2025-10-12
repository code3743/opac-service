export interface BorrowHistory {
  identifier: string;
  title: string;
  location: string;
  transactionType: string;
  date: string;
}

export interface Program {
  code: string;
  name: string;
}


export interface BorrowedBook {
  title: string;
  author: string;
  dueDate: string;
}

export interface StudentProfile {
  code: string;
  firstName: string;
  fullName: string;
  programs: Program[] | null;
  fine: number;
  history: BorrowHistory[];
  borrowedBooks: BorrowedBook[];
  location: string;
}
