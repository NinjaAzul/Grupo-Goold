'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar se já existem agendamentos
    const [existingAppointments] = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM appointments`
    );

    if (existingAppointments[0].count > 0) {
      console.log('Appointments already exist, skipping seed.');
      return;
    }

    // Buscar ou criar usuários de teste
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role_id = 2 LIMIT 5`
    );

    let userIds = users.map((u) => u.id);

    // Se não houver usuários USER, criar alguns de teste
    if (userIds.length === 0) {
      const [roleUser] = await queryInterface.sequelize.query(
        `SELECT id FROM roles WHERE name = 'USER' LIMIT 1`
      );

      if (!roleUser || roleUser.length === 0) {
        console.log('USER role not found. Please run roles seed first.');
        return;
      }

      // Verificar quais usuários de teste já existem
      const testUserEmails = [
        'joao.silva@example.com',
        'maria.santos@example.com',
        'pedro.oliveira@example.com',
        'ana.costa@example.com',
        'carlos.ferreira@example.com',
      ];

      const [existingTestUsers] = await queryInterface.sequelize.query(
        `SELECT id, email FROM users WHERE email IN (${testUserEmails.map(() => '?').join(',')})`,
        {
          replacements: testUserEmails,
        }
      );

      const existingEmails = existingTestUsers.map((u) => u.email);
      const usersToCreate = [];

      const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || '12345678';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      const testUsersData = [
        {
          first_name: 'João',
          last_name: 'Silva',
          email: 'joao.silva@example.com',
        },
        {
          first_name: 'Maria',
          last_name: 'Santos',
          email: 'maria.santos@example.com',
        },
        {
          first_name: 'Pedro',
          last_name: 'Oliveira',
          email: 'pedro.oliveira@example.com',
        },
        {
          first_name: 'Ana',
          last_name: 'Costa',
          email: 'ana.costa@example.com',
        },
        {
          first_name: 'Carlos',
          last_name: 'Ferreira',
          email: 'carlos.ferreira@example.com',
        },
      ];

      // Criar apenas usuários que não existem
      testUsersData.forEach((user) => {
        if (!existingEmails.includes(user.email)) {
          usersToCreate.push({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: hashedPassword,
            role_id: roleUser[0].id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      });

      if (usersToCreate.length > 0) {
        await queryInterface.bulkInsert('users', usersToCreate, {});
        console.log(`Created ${usersToCreate.length} test users.`);
      }

      // Buscar todos os IDs dos usuários de teste (existentes + recém-criados)
      const [allTestUsers] = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email IN (${testUserEmails.map(() => '?').join(',')})`,
        {
          replacements: testUserEmails,
        }
      );
      userIds = allTestUsers.map((u) => u.id);

      if (existingTestUsers.length > 0) {
        console.log(`Using ${existingTestUsers.length} existing test users.`);
      }
    }

    if (userIds.length === 0) {
      console.log('No users available to create appointments.');
      return;
    }

    // Criar agendamentos de teste
    const now = new Date();
    const appointments = [];

    // Agendamentos para hoje
    const today = new Date(now);
    today.setHours(10, 0, 0, 0);
    appointments.push({
      user_id: userIds[0],
      appointment_date: new Date(today),
      room: 'Sala 01',
      status: 'scheduled',
      created_at: new Date(),
      updated_at: new Date(),
    });

    today.setHours(14, 30, 0, 0);
    appointments.push({
      user_id: userIds[1],
      appointment_date: new Date(today),
      room: 'Sala 02',
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Agendamentos para amanhã
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    appointments.push({
      user_id: userIds[2],
      appointment_date: new Date(tomorrow),
      room: 'Sala 01',
      status: 'scheduled',
      created_at: new Date(),
      updated_at: new Date(),
    });

    tomorrow.setHours(11, 0, 0, 0);
    appointments.push({
      user_id: userIds[0],
      appointment_date: new Date(tomorrow),
      room: 'Sala 03',
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    });

    tomorrow.setHours(15, 0, 0, 0);
    appointments.push({
      user_id: userIds[3],
      appointment_date: new Date(tomorrow),
      room: 'Sala 02',
      status: 'cancelled',
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Agendamentos para depois de amanhã
    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    dayAfterTomorrow.setHours(10, 0, 0, 0);
    appointments.push({
      user_id: userIds[4],
      appointment_date: new Date(dayAfterTomorrow),
      room: 'Sala 01',
      status: 'scheduled',
      created_at: new Date(),
      updated_at: new Date(),
    });

    dayAfterTomorrow.setHours(13, 30, 0, 0);
    appointments.push({
      user_id: userIds[1],
      appointment_date: new Date(dayAfterTomorrow),
      room: 'Sala 03',
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Agendamentos para a próxima semana
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(9, 0, 0, 0);
    appointments.push({
      user_id: userIds[2],
      appointment_date: new Date(nextWeek),
      room: 'Sala 02',
      status: 'scheduled',
      created_at: new Date(),
      updated_at: new Date(),
    });

    nextWeek.setHours(14, 0, 0, 0);
    appointments.push({
      user_id: userIds[3],
      appointment_date: new Date(nextWeek),
      room: 'Sala 01',
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Agendamentos passados (para teste de histórico)
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    lastWeek.setHours(10, 0, 0, 0);
    appointments.push({
      user_id: userIds[4],
      appointment_date: new Date(lastWeek),
      room: 'Sala 01',
      status: 'scheduled',
      created_at: new Date(),
      updated_at: new Date(),
    });

    lastWeek.setHours(15, 0, 0, 0);
    appointments.push({
      user_id: userIds[0],
      appointment_date: new Date(lastWeek),
      room: 'Sala 02',
      status: 'cancelled',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await queryInterface.bulkInsert('appointments', appointments, {});

    console.log(`Created ${appointments.length} test appointments.`);
    console.log('Appointments created with various statuses:');
    console.log(`- Scheduled: ${appointments.filter((a) => a.status === 'scheduled').length}`);
    console.log(`- Pending: ${appointments.filter((a) => a.status === 'pending').length}`);
    console.log(`- Cancelled: ${appointments.filter((a) => a.status === 'cancelled').length}`);
  },

  async down(queryInterface, Sequelize) {
    // Remover agendamentos de teste
    await queryInterface.bulkDelete('appointments', {
      room: {
        [Sequelize.Op.in]: ['Sala 01', 'Sala 02', 'Sala 03'],
      },
    });

    // Remover usuários de teste (opcional - comentado para não deletar dados importantes)
    // await queryInterface.bulkDelete('users', {
    //   email: {
    //     [Sequelize.Op.in]: [
    //       'joao.silva@example.com',
    //       'maria.santos@example.com',
    //       'pedro.oliveira@example.com',
    //       'ana.costa@example.com',
    //       'carlos.ferreira@example.com',
    //     ],
    //   },
    // });
  },
};
