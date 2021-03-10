select * from `gl_tran_hist` g group by account_id, trans_type order by account_id;

select account_id, trans_type, amount from `gl_tran_hist` g group by trans_type, account_id order by account_id;

select g.account_id, gl.`account_title`, trans_type, sum(amount) from `gl_tran_hist` g inner join general_ledger gl ON gl.`account_id` = g.`account_id` group by account_id, trans_type order by account_id;