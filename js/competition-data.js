// Competition records are kept in separate buckets. Match rows must carry
// the same competitionId as the bucket they are stored in.
(function (window) {
    'use strict';

    var competitions = {
        fkf: {
            id: 'fkf',
            name: 'FKF League',
            governingBody: 'Football Kenya Federation',
            status: 'active',
            pointsRules: null,
            recordsNote: 'The existing FKF standings snapshot is retained; individual FKF match records were not present in the project.',
            standings: {
                zone: 'Zone A',
                played: 10,
                wins: 5,
                draws: 5,
                losses: 0,
                points: 20,
                goalsFor: 11,
                goalsAgainst: 2,
                goalDifference: 9,
                date: '29/07/2026'
            },
            fixtures: [],
            matches: []
        },
        cfk: {
            id: 'cfk',
            name: 'CFK Tournament',
            status: 'in-progress',
            pointsRules: null,
            recordsNote: 'The tournament is in progress, but no verified CFK fixtures or results were present in the project.',
            standings: null,
            fixtures: [],
            matches: []
        }
    };

    function getCompetition(competitionId) {
        if (!Object.prototype.hasOwnProperty.call(competitions, competitionId)) {
            throw new Error('Unknown competition: ' + competitionId);
        }
        return competitions[competitionId];
    }

    function calculateMatchStats(competitionId, matches) {
        var competition = getCompetition(competitionId);
        var records = matches || competition.matches;
        var teams = Object.create(null);
        var matchIds = Object.create(null);

        records.forEach(function (match) {
            if (match.competitionId !== competitionId) {
                throw new Error('Match ' + match.id + ' belongs to a different competition.');
            }
            if (!match.id || matchIds[match.id]) {
                throw new Error('Every match must have a unique ID.');
            }
            if (!Number.isInteger(match.homeScore) || match.homeScore < 0 ||
                !Number.isInteger(match.awayScore) || match.awayScore < 0) {
                throw new Error('Match scores must be non-negative integers.');
            }
            if (typeof match.homeTeam !== 'string' || !match.homeTeam ||
                typeof match.awayTeam !== 'string' || !match.awayTeam ||
                match.homeTeam === match.awayTeam) {
                throw new Error('Each match must identify two different teams.');
            }

            matchIds[match.id] = true;
            [match.homeTeam, match.awayTeam].forEach(function (teamName) {
                if (!teams[teamName]) {
                    teams[teamName] = {
                        team: teamName,
                        played: 0,
                        wins: 0,
                        draws: 0,
                        losses: 0,
                        goalsFor: 0,
                        goalsAgainst: 0,
                        goalDifference: 0,
                        points: null
                    };
                }
            });

            var home = teams[match.homeTeam];
            var away = teams[match.awayTeam];
            home.played += 1;
            away.played += 1;
            home.goalsFor += match.homeScore;
            home.goalsAgainst += match.awayScore;
            away.goalsFor += match.awayScore;
            away.goalsAgainst += match.homeScore;

            if (match.homeScore > match.awayScore) {
                home.wins += 1;
                away.losses += 1;
            } else if (match.homeScore < match.awayScore) {
                home.losses += 1;
                away.wins += 1;
            } else {
                home.draws += 1;
                away.draws += 1;
            }
        });

        Object.keys(teams).forEach(function (teamName) {
            var team = teams[teamName];
            team.goalDifference = team.goalsFor - team.goalsAgainst;
            if (competition.pointsRules) {
                team.points = team.wins * competition.pointsRules.win +
                    team.draws * competition.pointsRules.draw +
                    team.losses * competition.pointsRules.loss;
            }
        });

        return Object.keys(teams).map(function (teamName) {
            return teams[teamName];
        });
    }

    function renderCompetitionStats() {
        document.querySelectorAll('[data-competition-stat]').forEach(function (element) {
            var section = element.closest('[data-competition-id]');
            if (!section) {
                return;
            }

            var competition = getCompetition(section.getAttribute('data-competition-id'));
            var field = element.getAttribute('data-competition-stat');
            var value = competition.standings && competition.standings[field];
            if (value !== undefined && value !== null) {
                element.textContent = value;
            }
        });
    }

    function renderMatchList(container) {
        var competitionId = container.getAttribute('data-match-list');
        var competition = getCompetition(competitionId);
        container.textContent = '';

        if (competition.matches.length === 0) {
            var pending = document.createElement('div');
            pending.className = 'fkf-pending-panel';
            var message = document.createElement('strong');
            message.textContent = competitionId === 'cfk'
                ? 'CFK Tournament is in progress; verified fixtures and results have not been added yet.'
                : 'No verified match records have been added yet.';
            pending.appendChild(message);
            container.appendChild(pending);
            return;
        }

        competition.matches.forEach(function (match) {
            if (match.competitionId !== competitionId) {
                throw new Error('Match ' + match.id + ' belongs to a different competition.');
            }

            var card = document.createElement('article');
            card.className = 'result-match';
            card.setAttribute('data-match-id', match.id);
            card.setAttribute('data-competition-id', competitionId);

            var top = document.createElement('div');
            top.className = 'match-top';
            var label = document.createElement('span');
            label.className = 'match-type';
            label.textContent = match.ageGroup + (match.date ? ' · ' + match.date : '');
            top.appendChild(label);

            var score = document.createElement('div');
            score.className = 'result-score';
            var home = document.createElement('div');
            home.className = 'team';
            var homeName = document.createElement('strong');
            homeName.textContent = match.homeTeam;
            home.appendChild(homeName);
            var scoreDisplay = document.createElement('div');
            scoreDisplay.className = 'score-display';
            scoreDisplay.textContent = match.homeScore + ' – ' + match.awayScore;
            var away = document.createElement('div');
            away.className = 'team';
            var awayName = document.createElement('strong');
            awayName.textContent = match.awayTeam;
            away.appendChild(awayName);
            score.appendChild(home);
            score.appendChild(scoreDisplay);
            score.appendChild(away);

            card.appendChild(top);
            card.appendChild(score);
            container.appendChild(card);
        });
    }

    function renderCompetitionMatches() {
        document.querySelectorAll('[data-match-list]').forEach(renderMatchList);
    }

    function renderFixtureList(container) {
        var competitionId = container.getAttribute('data-fixture-list');
        var competition = getCompetition(competitionId);
        container.textContent = '';

        if (competition.fixtures.length === 0) {
            var pending = document.createElement('div');
            pending.className = 'fkf-pending-panel';
            var message = document.createElement('strong');
            message.textContent = competitionId === 'cfk'
                ? 'Fixtures coming soon'
                : 'No verified ' + competition.name + ' fixtures are recorded in the project yet.';
            pending.appendChild(message);
            if (competitionId === 'cfk') {
                var details = document.createElement('span');
                details.textContent = 'CFK Tournament fixtures will be posted here once confirmed.';
                pending.appendChild(details);
            }
            container.appendChild(pending);
            return;
        }

        competition.fixtures.forEach(function (fixture) {
            if (fixture.competitionId !== competitionId) {
                throw new Error('Fixture ' + fixture.id + ' belongs to a different competition.');
            }

            var card = document.createElement('article');
            card.className = 'fkf-squad-card';
            card.setAttribute('data-fixture-id', fixture.id);
            card.setAttribute('data-competition-id', competitionId);
            var details = document.createElement('p');
            details.className = 'fkf-squad-description';
            details.textContent = [fixture.date, fixture.ageGroup, fixture.homeTeam + ' vs ' + fixture.awayTeam]
                .filter(Boolean)
                .join(' · ');
            card.appendChild(details);
            container.appendChild(card);
        });
    }

    function renderCompetitionFixtures() {
        document.querySelectorAll('[data-fixture-list]').forEach(renderFixtureList);
    }

    window.YoungCityCompetitionData = {
        competitions: competitions,
        getCompetition: getCompetition,
        calculateMatchStats: calculateMatchStats
    };

    document.addEventListener('DOMContentLoaded', function () {
        renderCompetitionStats();
        renderCompetitionMatches();
        renderCompetitionFixtures();
    });
})(window);
