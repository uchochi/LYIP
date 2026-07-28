import { writeFileSync } from 'node:fs'
import { allPersonas } from './personas.js'
import type { Persona } from './personas.js'

function buildInsert(persona: Persona): string {
  const email = esc(persona.email)
  const name = esc(persona.name)
  const password = esc(persona.password)
  const appMeta = persona.type === 'moderator'
    ? `'{"provider":"email","providers":["email"],"role":"admin"}'::jsonb`
    : `'{"provider":"email","providers":["email"]}'::jsonb`
  const userMeta = `jsonb_build_object('name', ${name}, 'email', ${email}, 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false)`
  const dbRole = esc(persona.role)

  return `  v_email := ${email};
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt(${password}, gen_salt('bf', 10)),
      ${appMeta},
      ${userMeta},
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, ${name}, ${dbRole});
  END IF;`
}

function esc(s: string): string {
  return `'${s.replace(/'/g, "''")}'`
}

function generateSql(): string {
  const lines: string[] = [
    'DO $$',
    'DECLARE',
    '  v_id uuid;',
    '  v_email text;',
    'BEGIN',
  ]

  for (const p of allPersonas) {
    lines.push(buildInsert(p))
  }

  lines.push('END $$;')
  return lines.join('\n')
}

const sql = generateSql()
writeFileSync(new URL('../create_users.sql', import.meta.url).pathname, sql, 'utf-8')
console.log(`Generated create_users.sql with ${allPersonas.length} personas`)
