import { SKILL_TYPE_LISTENING, SKILL_TYPE_READING } from "../../../modules/share/constraint";
import Skill from "../../../modules/share/model/skill";
import { GameObjectStatus, QuestionItem } from "./game.core";

export type SkillTypeValues = Array<{
	type: number; value: number;
}>

export type TOEICBaremScore = {
	[correct: number]: {
		[skillName: string]: number
	}
}

export const toeicBaremScore: TOEICBaremScore = {
	0: {
		"listening": 5,
		"reading": 5
	},
	1: {
		"listening": 15,
		"reading": 5
	},
	2: {
		"listening": 20,
		"reading": 5
	},
	3: {
		"listening": 25,
		"reading": 10
	},
	4: {
		"listening": 30,
		"reading": 15
	},
	5: {
		"listening": 355,
		"reading": 20
	},
	6: {
		"listening": 40,
		"reading": 25
	},
	7: {
		"listening": 45,
		"reading": 30
	},
	8: {
		"listening": 50,
		"reading": 35
	},
	9: {
		"listening": 55,
		"reading": 40
	},
	10: {
		"listening": 60,
		"reading": 45
	},
	11: {
		"listening": 65,
		"reading": 50
	},
	12: {
		"listening": 70,
		"reading": 55
	},
	13: {
		"listening": 75,
		"reading": 60
	},
	14: {
		"listening": 80,
		"reading": 65
	},
	15: {
		"listening": 85,
		"reading": 70
	},
	16: {
		"listening": 90,
		"reading": 75
	},
	17: {
		"listening": 95,
		"reading": 80
	},
	18: {
		"listening": 100,
		"reading": 85
	},
	19: {
		"listening": 105,
		"reading": 90
	},
	20: {
		"listening": 110,
		"reading": 95
	},
	21: {
		"listening": 115,
		"reading": 100
	},
	22: {
		"listening": 120,
		"reading": 105
	},
	23: {
		"listening": 125,
		"reading": 110
	},
	24: {
		"listening": 130,
		"reading": 115
	},
	25: {
		"listening": 135,
		"reading": 120
	},
	26: {
		"listening": 140,
		"reading": 125
	},
	27: {
		"listening": 145,
		"reading": 130
	},
	28: {
		"listening": 150,
		"reading": 135
	},
	29: {
		"listening": 155,
		"reading": 140
	},
	30: {
		"listening": 160,
		"reading": 145
	},
	31: {
		"listening": 165,
		"reading": 150
	},
	32: {
		"listening": 170,
		"reading": 155
	},
	33: {
		"listening": 175,
		"reading": 160
	},
	34: {
		"listening": 180,
		"reading": 165
	},
	35: {
		"listening": 185,
		"reading": 170
	},
	36: {
		"listening": 190,
		"reading": 175
	},
	37: {
		"listening": 195,
		"reading": 180
	},
	38: {
		"listening": 200,
		"reading": 185
	},
	39: {
		"listening": 205,
		"reading": 190
	},
	40: {
		"listening": 210,
		"reading": 195
	},
	41: {
		"listening": 215,
		"reading": 200
	},
	42: {
		"listening": 220,
		"reading": 205
	},
	43: {
		"listening": 225,
		"reading": 210
	},
	44: {
		"listening": 230,
		"reading": 215
	},
	45: {
		"listening": 235,
		"reading": 220
	},
	46: {
		"listening": 240,
		"reading": 225
	},
	47: {
		"listening": 245,
		"reading": 230
	},
	48: {
		"listening": 250,
		"reading": 235
	},
	49: {
		"listening": 255,
		"reading": 240
	},
	50: {
		"listening": 260,
		"reading": 245
	},
	51: {
		"listening": 265,
		"reading": 250
	},
	52: {
		"listening": 270,
		"reading": 255
	},
	53: {
		"listening": 275,
		"reading": 260
	},
	54: {
		"listening": 280,
		"reading": 265
	},
	55: {
		"listening": 285,
		"reading": 270
	},
	56: {
		"listening": 290,
		"reading": 275
	},
	57: {
		"listening": 295,
		"reading": 280
	},
	58: {
		"listening": 300,
		"reading": 285
	},
	59: {
		"listening": 305,
		"reading": 290
	},
	60: {
		"listening": 310,
		"reading": 295
	},
	61: {
		"listening": 315,
		"reading": 300
	},
	62: {
		"listening": 320,
		"reading": 305
	},
	63: {
		"listening": 325,
		"reading": 310
	},
	64: {
		"listening": 330,
		"reading": 315
	},
	65: {
		"listening": 335,
		"reading": 320
	},
	66: {
		"listening": 340,
		"reading": 325
	},
	67: {
		"listening": 345,
		"reading": 330
	},
	68: {
		"listening": 350,
		"reading": 335
	},
	69: {
		"listening": 355,
		"reading": 340
	},
	70: {
		"listening": 360,
		"reading": 345
	},
	71: {
		"listening": 365,
		"reading": 350
	},
	72: {
		"listening": 370,
		"reading": 355
	},
	73: {
		"listening": 375,
		"reading": 360
	},
	74: {
		"listening": 380,
		"reading": 365
	},
	75: {
		"listening": 385,
		"reading": 370
	},
	76: {
		"listening": 395,
		"reading": 375
	},
	77: {
		"listening": 400,
		"reading": 380
	},
	78: {
		"listening": 405,
		"reading": 385
	},
	79: {
		"listening": 410,
		"reading": 390
	},
	80: {
		"listening": 415,
		"reading": 395
	},
	81: {
		"listening": 420,
		"reading": 400
	},
	82: {
		"listening": 425,
		"reading": 405
	},
	83: {
		"listening": 430,
		"reading": 410
	},
	84: {
		"listening": 435,
		"reading": 415
	},
	85: {
		"listening": 440,
		"reading": 420
	},
	86: {
		"listening": 445,
		"reading": 425
	},
	87: {
		"listening": 450,
		"reading": 430
	},
	88: {
		"listening": 455,
		"reading": 435
	},
	89: {
		"listening": 460,
		"reading": 440
	},
	90: {
		"listening": 465,
		"reading": 445
	},
	91: {
		"listening": 470,
		"reading": 450
	},
	92: {
		"listening": 475,
		"reading": 455
	},
	93: {
		"listening": 480,
		"reading": 460
	},
	94: {
		"listening": 485,
		"reading": 465
	},
	95: {
		"listening": 490,
		"reading": 470
	},
	96: {
		"listening": 495,
		"reading": 475
	},
	97: {
		"listening": 495,
		"reading": 480
	},
	98: {
		"listening": 495,
		"reading": 485
	},
	99: {
		"listening": 495,
		"reading": 490
	},
	100: {
		"listening": 495,
		"reading": 495
	}
}

export const getSkillTypeValues = (
	/** Array of parent **skills** with their children skills */
	skills: Array<Skill>
): SkillTypeValues => {
	const skillTypeValues: SkillTypeValues = [];
	skills.forEach((skill) => {
		skillTypeValues.push(
			{ type: skill.type, value: skill.value },
			...((skill.childSkills ?? []).map((cSkill) => ({ type: cSkill.type, value: cSkill.value })))
		)
	});
	return skillTypeValues;
}

export const getTOEICScore = (args: {
	skillTypeValues: SkillTypeValues;
	questionItems: QuestionItem[];
}) => {
	const {
		skillTypeValues, questionItems
	} = args;
	const mapStats: {
		[skillType: number]: {
			count: number; correct: number; score: number
		}
	} = {};
	[SKILL_TYPE_LISTENING, SKILL_TYPE_READING].forEach((skillType) => {
		const values = skillTypeValues.filter(({ type }) => type === skillType).map(({ value }) => value);
		const questions = questionItems.filter(({ skillValue }) => values.includes(skillValue));
		const correct = questions.filter(({ status, correct }) => status === GameObjectStatus.ANSWERED && correct).length;
		const _correct = Math.round(correct * 100 / (questions.length || 1));
		const key = skillType === SKILL_TYPE_LISTENING
			? "listening"
			: "reading"
		const score = toeicBaremScore[_correct][key];
		mapStats[skillType] = {
			count: questions.length, correct, score
		};
	});
	const score = Object.values(mapStats).reduce((total, { score }) => total += score, 0);
	return {
		score,
		mapStats
	};
};