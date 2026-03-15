create policy "payment_attempts_insert_own"
on public.payment_attempts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "payment_attempts_update_own"
on public.payment_attempts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
