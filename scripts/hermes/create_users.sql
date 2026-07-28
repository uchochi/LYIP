DO $$
DECLARE
  v_id uuid;
  v_email text;
BEGIN
  v_email := 'ada.obi.hermes1@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#1_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
      jsonb_build_object('name', 'Ada Obi', 'email', 'ada.obi.hermes1@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Ada Obi', 'admin');
  END IF;
  v_email := 'kwame.asante.hermes2@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#2_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
      jsonb_build_object('name', 'Kwame Asante', 'email', 'kwame.asante.hermes2@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Kwame Asante', 'admin');
  END IF;
  v_email := 'zara.okafor.hermes3@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#3_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
      jsonb_build_object('name', 'Zara Okafor', 'email', 'zara.okafor.hermes3@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Zara Okafor', 'admin');
  END IF;
  v_email := 'chidi.eze.hermes10@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#10_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Chidi Eze', 'email', 'chidi.eze.hermes10@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Chidi Eze', 'instructor');
  END IF;
  v_email := 'amina.diallo.hermes11@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#11_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Amina Diallo', 'email', 'amina.diallo.hermes11@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Amina Diallo', 'senior_instructor');
  END IF;
  v_email := 'tunde.balogun.hermes12@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#12_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Tunde Balogun', 'email', 'tunde.balogun.hermes12@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Tunde Balogun', 'instructor');
  END IF;
  v_email := 'nkechi.okoro.hermes13@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#13_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Nkechi Okoro', 'email', 'nkechi.okoro.hermes13@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Nkechi Okoro', 'instructor');
  END IF;
  v_email := 'sipho.mbeki.hermes14@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#14_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Sipho Mbeki', 'email', 'sipho.mbeki.hermes14@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Sipho Mbeki', 'instructor');
  END IF;
  v_email := 'fatima.hassan.hermes15@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#15_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Fatima Hassan', 'email', 'fatima.hassan.hermes15@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Fatima Hassan', 'senior_instructor');
  END IF;
  v_email := 'kofi.mensah.hermes16@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#16_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Kofi Mensah', 'email', 'kofi.mensah.hermes16@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Kofi Mensah', 'instructor');
  END IF;
  v_email := 'yaa.asantewaa.hermes17@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#17_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Yaa Asantewaa', 'email', 'yaa.asantewaa.hermes17@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Yaa Asantewaa', 'instructor');
  END IF;
  v_email := 'jelani.nkosi.hermes18@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#18_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Jelani Nkosi', 'email', 'jelani.nkosi.hermes18@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Jelani Nkosi', 'instructor');
  END IF;
  v_email := 'amara.eze.hermes19@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#19_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Amara Eze', 'email', 'amara.eze.hermes19@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Amara Eze', 'instructor');
  END IF;
  v_email := 'babatunde.lawal.hermes20@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#20_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Babatunde Lawal', 'email', 'babatunde.lawal.hermes20@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Babatunde Lawal', 'instructor');
  END IF;
  v_email := 'chioma.nwosu.hermes21@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#21_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Chioma Nwosu', 'email', 'chioma.nwosu.hermes21@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Chioma Nwosu', 'instructor');
  END IF;
  v_email := 'dumisani.khumalo.hermes22@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#22_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Dumisani Khumalo', 'email', 'dumisani.khumalo.hermes22@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Dumisani Khumalo', 'apprentice');
  END IF;
  v_email := 'esi.akyea.hermes23@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#23_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Esi Akyea', 'email', 'esi.akyea.hermes23@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Esi Akyea', 'instructor');
  END IF;
  v_email := 'foluke.adeyemi.hermes24@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#24_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Foluke Adeyemi', 'email', 'foluke.adeyemi.hermes24@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Foluke Adeyemi', 'instructor');
  END IF;
  v_email := 'ghana.kofi.hermes25@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#25_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Ghana Kofi', 'email', 'ghana.kofi.hermes25@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Ghana Kofi', 'instructor');
  END IF;
  v_email := 'hauwa.mohammed.hermes26@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#26_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Hauwa Mohammed', 'email', 'hauwa.mohammed.hermes26@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Hauwa Mohammed', 'apprentice');
  END IF;
  v_email := 'ifeanyi.okafor.hermes27@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#27_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Ifeanyi Okafor', 'email', 'ifeanyi.okafor.hermes27@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Ifeanyi Okafor', 'instructor');
  END IF;
  v_email := 'jomo.kenyatta.hermes28@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#28_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Jomo Kenyatta', 'email', 'jomo.kenyatta.hermes28@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Jomo Kenyatta', 'instructor');
  END IF;
  v_email := 'kadija.sesay.hermes29@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#29_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Kadija Sesay', 'email', 'kadija.sesay.hermes29@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Kadija Sesay', 'apprentice');
  END IF;
  v_email := 'lekan.soyinka.hermes30@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#30_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Lekan Soyinka', 'email', 'lekan.soyinka.hermes30@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Lekan Soyinka', 'instructor');
  END IF;
  v_email := 'makeda.haile.hermes31@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#31_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Makeda Haile', 'email', 'makeda.haile.hermes31@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Makeda Haile', 'instructor');
  END IF;
  v_email := 'ngozi.adichie.hermes32@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#32_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Ngozi Adichie', 'email', 'ngozi.adichie.hermes32@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Ngozi Adichie', 'apprentice');
  END IF;
  v_email := 'oluwaseun.adebayo.hermes33@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#33_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Oluwaseun Adebayo', 'email', 'oluwaseun.adebayo.hermes33@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Oluwaseun Adebayo', 'instructor');
  END IF;
  v_email := 'precious.moyo.hermes34@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#34_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Precious Moyo', 'email', 'precious.moyo.hermes34@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Precious Moyo', 'instructor');
  END IF;
  v_email := 'rashid.khamisi.hermes35@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#35_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Rashid Khamisi', 'email', 'rashid.khamisi.hermes35@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Rashid Khamisi', 'instructor');
  END IF;
  v_email := 'sade.ogunyemi.hermes36@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#36_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Sade Ogunyemi', 'email', 'sade.ogunyemi.hermes36@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Sade Ogunyemi', 'apprentice');
  END IF;
  v_email := 'thabo.mokoena.hermes37@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#37_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Thabo Mokoena', 'email', 'thabo.mokoena.hermes37@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Thabo Mokoena', 'instructor');
  END IF;
  v_email := 'uche.obi.hermes38@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#38_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Uche Obi', 'email', 'uche.obi.hermes38@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Uche Obi', 'instructor');
  END IF;
  v_email := 'wanjiku.kimani.hermes39@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#39_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Wanjiku Kimani', 'email', 'wanjiku.kimani.hermes39@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Wanjiku Kimani', 'instructor');
  END IF;
  v_email := 'abayomi.ojo.hermes40@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#40_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Abayomi Ojo', 'email', 'abayomi.ojo.hermes40@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Abayomi Ojo', 'apprentice');
  END IF;
  v_email := 'binta.camara.hermes41@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#41_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Binta Camara', 'email', 'binta.camara.hermes41@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Binta Camara', 'apprentice');
  END IF;
  v_email := 'chika.okeke.hermes42@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#42_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Chika Okeke', 'email', 'chika.okeke.hermes42@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Chika Okeke', 'apprentice');
  END IF;
  v_email := 'diarra.traore.hermes43@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#43_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Diarra Traore', 'email', 'diarra.traore.hermes43@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Diarra Traore', 'apprentice');
  END IF;
  v_email := 'ekene.nwankwo.hermes44@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#44_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Ekene Nwankwo', 'email', 'ekene.nwankwo.hermes44@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Ekene Nwankwo', 'apprentice');
  END IF;
  v_email := 'farida.bello.hermes45@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#45_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Farida Bello', 'email', 'farida.bello.hermes45@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Farida Bello', 'apprentice');
  END IF;
  v_email := 'goma.luhaka.hermes46@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#46_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Goma Luhaka', 'email', 'goma.luhaka.hermes46@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Goma Luhaka', 'apprentice');
  END IF;
  v_email := 'habib.sall.hermes47@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#47_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Habib Sall', 'email', 'habib.sall.hermes47@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Habib Sall', 'apprentice');
  END IF;
  v_email := 'idris.fagbemi.hermes48@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#48_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Idris Fagbemi', 'email', 'idris.fagbemi.hermes48@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Idris Fagbemi', 'apprentice');
  END IF;
  v_email := 'jendayi.mabaso.hermes49@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#49_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Jendayi Mabaso', 'email', 'jendayi.mabaso.hermes49@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Jendayi Mabaso', 'apprentice');
  END IF;
  v_email := 'kesi.osei.hermes50@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#50_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Kesi Osei', 'email', 'kesi.osei.hermes50@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Kesi Osei', 'apprentice');
  END IF;
  v_email := 'lungile.dlamini.hermes51@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#51_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Lungile Dlamini', 'email', 'lungile.dlamini.hermes51@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Lungile Dlamini', 'apprentice');
  END IF;
  v_email := 'mensah.bonsu.hermes52@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#52_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Mensah Bonsu', 'email', 'mensah.bonsu.hermes52@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Mensah Bonsu', 'apprentice');
  END IF;
  v_email := 'naledi.mogale.hermes53@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#53_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Naledi Mogale', 'email', 'naledi.mogale.hermes53@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Naledi Mogale', 'apprentice');
  END IF;
  v_email := 'ogochukwu.eze.hermes54@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#54_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Ogochukwu Eze', 'email', 'ogochukwu.eze.hermes54@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Ogochukwu Eze', 'apprentice');
  END IF;
  v_email := 'palesa.mohlala.hermes55@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#55_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Palesa Mohlala', 'email', 'palesa.mohlala.hermes55@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Palesa Mohlala', 'apprentice');
  END IF;
  v_email := 'qudus.akinlade.hermes56@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#56_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Qudus Akinlade', 'email', 'qudus.akinlade.hermes56@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Qudus Akinlade', 'apprentice');
  END IF;
  v_email := 'ramatoulie.jallow.hermes57@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#57_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Ramatoulie Jallow', 'email', 'ramatoulie.jallow.hermes57@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Ramatoulie Jallow', 'apprentice');
  END IF;
  v_email := 'sekou.toure.hermes58@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#58_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Sekou Toure', 'email', 'sekou.toure.hermes58@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Sekou Toure', 'apprentice');
  END IF;
  v_email := 'tendai.gumbo.hermes59@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#59_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Tendai Gumbo', 'email', 'tendai.gumbo.hermes59@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Tendai Gumbo', 'apprentice');
  END IF;
  v_email := 'umaru.sillah.hermes60@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#60_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Umaru Sillah', 'email', 'umaru.sillah.hermes60@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Umaru Sillah', 'apprentice');
  END IF;
  v_email := 'vuyo.zondi.hermes61@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#61_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Vuyo Zondi', 'email', 'vuyo.zondi.hermes61@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Vuyo Zondi', 'apprentice');
  END IF;
  v_email := 'wambui.gichinga.hermes62@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#62_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Wambui Gichinga', 'email', 'wambui.gichinga.hermes62@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Wambui Gichinga', 'apprentice');
  END IF;
  v_email := 'xola.ndlovu.hermes63@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#63_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Xola Ndlovu', 'email', 'xola.ndlovu.hermes63@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Xola Ndlovu', 'apprentice');
  END IF;
  v_email := 'yewande.adekunle.hermes64@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#64_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Yewande Adekunle', 'email', 'yewande.adekunle.hermes64@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Yewande Adekunle', 'apprentice');
  END IF;
  v_email := 'zanele.mthembu.hermes65@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#65_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Zanele Mthembu', 'email', 'zanele.mthembu.hermes65@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Zanele Mthembu', 'apprentice');
  END IF;
  v_email := 'akintunde.balogun.hermes66@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#66_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Akintunde Balogun', 'email', 'akintunde.balogun.hermes66@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Akintunde Balogun', 'apprentice');
  END IF;
  v_email := 'bosede.ajayi.hermes67@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#67_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Bosede Ajayi', 'email', 'bosede.ajayi.hermes67@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Bosede Ajayi', 'apprentice');
  END IF;
  v_email := 'chanda.banda.hermes68@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#68_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Chanda Banda', 'email', 'chanda.banda.hermes68@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Chanda Banda', 'apprentice');
  END IF;
  v_email := 'desta.negassi.hermes69@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#69_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Desta Negassi', 'email', 'desta.negassi.hermes69@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Desta Negassi', 'apprentice');
  END IF;
  v_email := 'efemena.uduak.hermes70@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#70_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Efemena Uduak', 'email', 'efemena.uduak.hermes70@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Efemena Uduak', 'apprentice');
  END IF;
  v_email := 'femi.ogunbiyi.hermes71@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#71_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Femi Ogunbiyi', 'email', 'femi.ogunbiyi.hermes71@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Femi Ogunbiyi', 'apprentice');
  END IF;
  v_email := 'gifty.nkrumah.hermes72@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#72_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Gifty Nkrumah', 'email', 'gifty.nkrumah.hermes72@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Gifty Nkrumah', 'apprentice');
  END IF;
  v_email := 'henry.udeze.hermes73@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#73_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Henry Udeze', 'email', 'henry.udeze.hermes73@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Henry Udeze', 'apprentice');
  END IF;
  v_email := 'imani.zuma.hermes74@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#74_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Imani Zuma', 'email', 'imani.zuma.hermes74@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Imani Zuma', 'apprentice');
  END IF;
  v_email := 'joana.quansah.hermes75@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#75_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Joana Quansah', 'email', 'joana.quansah.hermes75@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Joana Quansah', 'apprentice');
  END IF;
  v_email := 'kelechi.azikiwe.hermes76@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#76_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Kelechi Azikiwe', 'email', 'kelechi.azikiwe.hermes76@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Kelechi Azikiwe', 'apprentice');
  END IF;
  v_email := 'lamin.bah.hermes77@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#77_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Lamin Bah', 'email', 'lamin.bah.hermes77@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Lamin Bah', 'apprentice');
  END IF;
  v_email := 'mariam.diallo.hermes78@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#78_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Mariam Diallo', 'email', 'mariam.diallo.hermes78@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Mariam Diallo', 'apprentice');
  END IF;
  v_email := 'nnaemeka.okonkwo.hermes79@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#79_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Nnaemeka Okonkwo', 'email', 'nnaemeka.okonkwo.hermes79@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Nnaemeka Okonkwo', 'apprentice');
  END IF;
  v_email := 'olabisi.oni.hermes80@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#80_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Olabisi Oni', 'email', 'olabisi.oni.hermes80@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Olabisi Oni', 'apprentice');
  END IF;
  v_email := 'phumzile.nkosi.hermes81@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#81_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Phumzile Nkosi', 'email', 'phumzile.nkosi.hermes81@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Phumzile Nkosi', 'apprentice');
  END IF;
  v_email := 'remilekun.akin.hermes82@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#82_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Remilekun Akin', 'email', 'remilekun.akin.hermes82@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Remilekun Akin', 'apprentice');
  END IF;
  v_email := 'sierra.bangura.hermes83@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#83_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Sierra Bangura', 'email', 'sierra.bangura.hermes83@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Sierra Bangura', 'apprentice');
  END IF;
  v_email := 'takunda.moyo.hermes84@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#84_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Takunda Moyo', 'email', 'takunda.moyo.hermes84@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Takunda Moyo', 'apprentice');
  END IF;
  v_email := 'uloma.nwachukwu.hermes85@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#85_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Uloma Nwachukwu', 'email', 'uloma.nwachukwu.hermes85@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Uloma Nwachukwu', 'apprentice');
  END IF;
  v_email := 'victoria.amadi.hermes86@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#86_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Victoria Amadi', 'email', 'victoria.amadi.hermes86@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Victoria Amadi', 'apprentice');
  END IF;
  v_email := 'wale.ogunlade.hermes87@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#87_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Wale Ogunlade', 'email', 'wale.ogunlade.hermes87@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Wale Ogunlade', 'apprentice');
  END IF;
  v_email := 'xavier.okyere.hermes88@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#88_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Xavier Okyere', 'email', 'xavier.okyere.hermes88@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Xavier Okyere', 'apprentice');
  END IF;
  v_email := 'yetunde.bakare.hermes89@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#89_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Yetunde Bakare', 'email', 'yetunde.bakare.hermes89@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Yetunde Bakare', 'apprentice');
  END IF;
  v_email := 'zuri.okonkwo.hermes90@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#90_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Zuri Okonkwo', 'email', 'zuri.okonkwo.hermes90@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Zuri Okonkwo', 'apprentice');
  END IF;
  v_email := 'ayo.ogunseinde.hermes91@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#91_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Ayo Ogunseinde', 'email', 'ayo.ogunseinde.hermes91@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Ayo Ogunseinde', 'apprentice');
  END IF;
  v_email := 'bongi.mthembu.hermes92@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#92_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Bongi Mthembu', 'email', 'bongi.mthembu.hermes92@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Bongi Mthembu', 'apprentice');
  END IF;
  v_email := 'caleb.etiene.hermes93@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#93_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Caleb Etiene', 'email', 'caleb.etiene.hermes93@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Caleb Etiene', 'apprentice');
  END IF;
  v_email := 'doyin.olaniyi.hermes94@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#94_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Doyin Olaniyi', 'email', 'doyin.olaniyi.hermes94@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Doyin Olaniyi', 'apprentice');
  END IF;
  v_email := 'ekwutosi.okeke.hermes95@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#95_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Ekwutosi Okeke', 'email', 'ekwutosi.okeke.hermes95@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Ekwutosi Okeke', 'apprentice');
  END IF;
  v_email := 'fola.adeleke.hermes96@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#96_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Fola Adeleke', 'email', 'fola.adeleke.hermes96@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Fola Adeleke', 'apprentice');
  END IF;
  v_email := 'gloria.ndungu.hermes97@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#97_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Gloria Ndungu', 'email', 'gloria.ndungu.hermes97@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Gloria Ndungu', 'apprentice');
  END IF;
  v_email := 'hakeem.bello.hermes98@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#98_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Hakeem Bello', 'email', 'hakeem.bello.hermes98@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Hakeem Bello', 'apprentice');
  END IF;
  v_email := 'ijeoma.nwosu.hermes99@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#99_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Ijeoma Nwosu', 'email', 'ijeoma.nwosu.hermes99@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Ijeoma Nwosu', 'apprentice');
  END IF;
  v_email := 'jabari.zuberi.hermes100@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#100_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Jabari Zuberi', 'email', 'jabari.zuberi.hermes100@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Jabari Zuberi', 'apprentice');
  END IF;
  v_email := 'kemi.adegoke.hermes101@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#101_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Kemi Adegoke', 'email', 'kemi.adegoke.hermes101@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Kemi Adegoke', 'apprentice');
  END IF;
  v_email := 'lindiwe.zulu.hermes102@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#102_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Lindiwe Zulu', 'email', 'lindiwe.zulu.hermes102@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Lindiwe Zulu', 'apprentice');
  END IF;
  v_email := 'musa.kallon.hermes103@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#103_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Musa Kallon', 'email', 'musa.kallon.hermes103@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Musa Kallon', 'apprentice');
  END IF;
  v_email := 'nyasha.chigumba.hermes104@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#104_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Nyasha Chigumba', 'email', 'nyasha.chigumba.hermes104@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Nyasha Chigumba', 'apprentice');
  END IF;
  v_email := 'obinna.okafor.hermes105@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#105_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Obinna Okafor', 'email', 'obinna.okafor.hermes105@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Obinna Okafor', 'apprentice');
  END IF;
  v_email := 'patience.eze.hermes106@loseyourip.hermes';
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    v_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role, email_change, confirmation_token, email_change_token_current, email_change_token_new, is_sso_user, email_confirmed_at)
    VALUES (v_id, '00000000-0000-0000-0000-000000000000',
      v_email, crypt('Hermes#106_pass', gen_salt('bf', 10)),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('name', 'Patience Eze', 'email', 'patience.eze.hermes106@loseyourip.hermes', 'sub', gen_random_uuid()::text, 'email_verified', true, 'phone_verified', false),
      now(), now(),
      'authenticated', 'authenticated', '',
      '', '', '',
      false,
      now());
    INSERT INTO public.users (id, email, name, role)
    VALUES (v_id, v_email, 'Patience Eze', 'apprentice');
  END IF;
END $$;