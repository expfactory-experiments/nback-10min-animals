# Brief Animals N-Back (nback-10min-animals)

## What is this?

This is a brief version of the N-back task. It is designed to take only 10 minutes to complete.

## Blocks

This experiment has 8 blocks. The first two blocks are 1-back, and exist to familiarize the participant with the task. The remaining blocks are "test" blocks, with 3 blocks of 2-back and 3 blocks of 3-back difficulty.

  - 1-back with response feedback (correct/incorrect/too slow)
  - 1-back (no feedback)
  - 2-back (no feedback)
  - 2-back (no feedback)
  - 2-back (no feedback)
  - 3-back (no feedback)
  - 3-back (no feedback)
  - 3-back (no feedback)

Each block has 20 (+ delay level) trials. Each block has exactly 7 targets (and 13 non-targets), where a target is an item in the sequence that matches the item N-back in the series (i.e., a "match").

## Stimuli

The stimulus set contains 10 animals, each drawn with a similar art style.

| bee | butterfly | elephant | fish | lion |
|---|---|---|---|---|
|  <img src="https://github.com/expfactory-experiments/nback-10min-animals/blob/53b6ca36591bcfec81913d0c87711345fe1523d0/stims/bee.svg"  width="120" height="120"> |  <img src="https://github.com/expfactory-experiments/nback-10min-animals/blob/53b6ca36591bcfec81913d0c87711345fe1523d0/stims/butterfly.svg" width="120" height="120"> |  <img src="https://github.com/expfactory-experiments/nback-10min-animals/blob/53b6ca36591bcfec81913d0c87711345fe1523d0/stims/elephant.svg"  width="120" height="120"> | <img src="https://github.com/expfactory-experiments/nback-10min-animals/blob/53b6ca36591bcfec81913d0c87711345fe1523d0/stims/fish.svg"  width="120" height="120">  | <img src="https://github.com/expfactory-experiments/nback-10min-animals/blob/53b6ca36591bcfec81913d0c87711345fe1523d0/stims/lion.svg"  width="120" height="120">  |

| lobster | parrot | pig | turtle | whale |
|---|---|---|---|---|
|  <img src="https://github.com/expfactory-experiments/nback-10min-animals/blob/53b6ca36591bcfec81913d0c87711345fe1523d0/stims/lobster.svg"  width="120" height="120"> | <img src="https://github.com/expfactory-experiments/nback-10min-animals/blob/53b6ca36591bcfec81913d0c87711345fe1523d0/stims/parrot.svg"  width="120" height="120">  | <img src="https://github.com/expfactory-experiments/nback-10min-animals/blob/53b6ca36591bcfec81913d0c87711345fe1523d0/stims/pig.svg"  width="120" height="120">  | <img src="https://github.com/expfactory-experiments/nback-10min-animals/blob/53b6ca36591bcfec81913d0c87711345fe1523d0/stims/tortoise.svg"  width="120" height="120">  |  <img src="https://github.com/expfactory-experiments/nback-10min-animals/blob/53b6ca36591bcfec81913d0c87711345fe1523d0/stims/whale.svg"  width="120" height="120"> |

The images used for these stimuli were created by [Freepik](https://www.freepik.com).

```
Author: Freepik
Sources: 
  https://www.flaticon.com/packs/sea-life-collection
  https://www.flaticon.com/packs/animals-19/2
  https://www.flaticon.com/free-icon/tortoise_1045269
  https://www.flaticon.com/free-icon/elephant_427560
  https://www.flaticon.com/free-icon/pig_616547X
  https://www.flaticon.com/free-icon/parrot_427487
```

## Timings

 - Stimulus on-screen: 500ms
 - Response deadline: 2000ms
 - Inter-Stimulus Interval (ISI): 500ms
 
The response deadline is adaptive. If participants miss (time-out on) 7 trials in a given block, then 500ms is added to the response deadline, up to a maximum of 3500ms. If participants miss fewer than 3 trials, then 500ms is subtracted from the response deadline, down to a minimum of 2000ms.

The justification for an adaptive response deadline is to not place participants with slower motor functioning (e.g., older participants) at a disadvantage. Time-outs are both frustrating from a user standpoint, and not particularly meaningful from the standpoint of analysis. As scoring is not based on accuracy and not response speed, the response deadline should not substantially impact the interpretation of results.

## Scoring

The task is scored by first identifying the Hits, Misses, Correct Rejections, and False Alarms in each of the 2-back and 3-back blocks. D-prime, a statistic that summarizes performance, is then calculated for each of these blocks. The average d-prime is taken from the 2-back and 3-back blocks for an overall task score. For more detail on scoring, see the included [R code](https://github.com/expfactory-experiments/nback-10min-animals/blob/master/expfactory.nback10minanimals/R/expfactory.nback10minanimals.R). For more on d-prime, see the [Wikipedia entry](https://en.wikipedia.org/wiki/Sensitivity_index).

To use the R code, you can install it as a library in your R environment.

```
library(devtools)
install_github('expfactory-experiments/nback-10min-animals/expfactory.nback10minanimals')
```

## How this task compares to other Experiment Factory n-back tasks

Experiment Factory has two other n-back tasks:

 - [n-back](https://github.com/expfactory-experiments/n-back)
 - [adaptive-n-back](https://github.com/expfactory-experiments/adaptive-n-back)
 
There are two key differences. First, nback-10min-animals is only 10-minutes in length. Second, nback-10min-animals uses animal objects as stimuli instead of letters. The motivation to use animals instead of letters was to create a better user experience and minimize the influence of culture and English language fluency on performance.

This task also used two attention probes to catch inattentive participants, and has a more user-friendly set of instructions.

### How much shorter is it?

Brief Animals N-Back (nback-10min-animals) has 160 trials and is designed to take about 10 minutes to complete. For comparison, adaptive-n-back has about 450 trials (it varies somewhat) and based on the completion times from a recent study it takes 23 minutes on average to complete; n-back has 325 trials. Although I'm not aware of data to test its length, given the timings are similar, because it is about 72% the length as measured in trials, we can expect it to take about 16.5 minutes to complete.


# Experiment Factory

Experiment Factory: Brief Animals N-Back (nback-10min-animals)

This is a task that is friendly for use in the [Experiment Factory](https://expfactory.github.io/expfactory). You can run it locally by putting these files in a web server, or use the Experiment Factory to generate a reproducible container. Check out the documentation above for more information, or [post an issue](https://www.github.com/expfactory/expfactory/issues) if you have any questions.

![https://expfactory.github.io/expfactory/img/expfactoryticketyellow.png](https://expfactory.github.io/expfactory/img/expfactoryticketyellow.png)

## Containers and Metadata
The repository builds and provides a set of containers and metadata files to help you run and understand the experiment.

 - [preview the experiment](https://expfactory-experiments.github.io/nback-10min-animals/) on Github pages
 - [use the container](https://hub.docker.com/r/expfactory/nback-10min-animals/) provided on Docker Hub, built from this repository. All previous versions are also found here based on Github commits.
 - [inspect metadata](https://github.com/expfactory-experiments/nback-10min-animals/tree/gh-pages) including manifests and packages associated with Github commits. While this table isn't rendered on Github pages, if you render the branch and look at the index.html you will have a pretty rendering of it. 
