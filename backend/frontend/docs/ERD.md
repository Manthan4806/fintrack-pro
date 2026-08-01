# Database Design

## Users

- id (UUID)
- full_name
- email
- password_hash
- created_at

---

## Accounts

- id
- user_id
- name
- account_type
- balance
- created_at

---

## Categories

- id
- user_id
- name
- type

---

## Transactions

- id
- user_id
- account_id
- category_id
- amount
- type
- note
- transaction_date

---

## Budgets

- id
- user_id
- category_id
- monthly_limit
- month
- year

---

## Savings Goals

- id
- user_id
- title
- target_amount
- current_amount
- target_date