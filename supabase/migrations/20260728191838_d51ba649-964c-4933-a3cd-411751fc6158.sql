CREATE POLICY "admins can manage authorized emails"
ON public.admin_authorized_emails
FOR ALL
TO authenticated
USING (private.is_admin())
WITH CHECK (private.is_admin());