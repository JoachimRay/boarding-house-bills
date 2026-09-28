import { useEffect, useState } from 'react';
import { fetchCustomers, type Customer } from '../data/customer';

import { problemFor, type Status } from '../data/problem';

export function useCustomers() {
  const [status, setStatus] = useState<Status>('loading');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [problem, setProblem] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    setStatus('loading');

    fetchCustomers()
      .then((rows) => {
        if (!live) return;
        setCustomers(rows);
        setStatus(rows.length === 0 ? 'empty' : 'content');
      })
      .catch((error) => {
        if (!live) return;
        setProblem(problemFor(error));
        setStatus('error');
      });

    return () => {
      live = false;
    };
  }, [attempt]);

  return {
    status,
    customers,
    problem,
    retry: () => setAttempt((value) => value + 1),
  };
}
