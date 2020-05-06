import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (!value) {
      throw Error('The value is not valid!');
    }

    if (type !== 'income' && type !== 'outcome') {
      throw Error('The type of transaction is not valid!');
    }

    if (type === 'income' && value <= 0) {
      throw Error('INCOME transaction. Value must be greather then ZERO');
    }

    const balance = this.transactionsRepository.getBalance();

    if (type === 'outcome' && value > Math.abs(balance.total)) {
      throw Error('Transaction OUTCOME, You are not allowed to use overdraft!');
    }
    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
